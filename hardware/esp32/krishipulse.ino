/*
 * KrishiPulse – Smart Agriculture and Water Management System Using IoT & ML
 * ESP32 Hardware Firmware (Arduino IDE / C++)
 *
 * Pin Connections:
 * - Capacitive Soil Moisture Sensor: Analog Pin GPIO 34 (ADC1_CH6)
 * - DHT11 (Temp & Humidity): Digital Pin GPIO 4
 * - Water Reservoir Float Switch: Digital Pin GPIO 25 (INPUT_PULLUP)
 * - Relay Module (Pump Control): Digital Pin GPIO 26 (OUTPUT)
 * - Onboard Status LED: GPIO 2
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <DHT.h>

// -----------------------------------------------------------------------------
// Configuration & Credentials
// -----------------------------------------------------------------------------
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API Base URL (Deployed Vercel HTTPS endpoint or local IP for dev)
const char* SERVER_BASE_URL = "https://your-project.vercel.app/api";

const char* DEVICE_ID     = "KP001";
const char* DEVICE_SECRET = "YOUR_DEVICE_AUTH_SECRET";

// Pin Assignments
#define PIN_SOIL_ADC     34
#define PIN_DHT          4
#define PIN_WATER_FLOAT  25
#define PIN_RELAY_PUMP   26
#define PIN_STATUS_LED   2

#define DHTTYPE          DHT11
DHT dht(PIN_DHT, DHTTYPE);

// Calibration Constants (Capacitive Soil Sensor v1.2)
// In air (dry): approx 3200 ADC, in pure water (saturated): approx 1450 ADC
const int AIR_VALUE   = 3200;
const int WATER_VALUE = 1450;

// Safety Cutoff Rules
const unsigned long MAX_PUMP_RUNTIME_MS = 600000; // 10 minutes safety cutoff
const unsigned long SENSOR_POST_INTERVAL_MS = 15000; // Send telemetry every 15s
const unsigned long COMMAND_POLL_INTERVAL_MS = 3000; // Check commands every 3s

// State Tracking
bool isPumpRunning = false;
unsigned long pumpStartTime = 0;
unsigned long lastSensorPostTime = 0;
unsigned long lastCommandPollTime = 0;

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n🌱 Starting KrishiPulse ESP32 Hardware Controller...");

  // Pin Modes
  pinMode(PIN_SOIL_ADC, INPUT);
  pinMode(PIN_WATER_FLOAT, INPUT_PULLUP);
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  // Default pump to OFF for safety
  digitalWrite(PIN_RELAY_PUMP, LOW);
  digitalWrite(PIN_STATUS_LED, LOW);

  dht.begin();

  // Connect to Wi-Fi
  connectWiFi();
}

// -----------------------------------------------------------------------------
// Main Loop
// -----------------------------------------------------------------------------
void loop() {
  // Ensure Wi-Fi remains connected
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  unsigned long currentMillis = millis();

  // 1. Safety Watchdog: enforce maximum continuous pump runtime
  if (isPumpRunning && (currentMillis - pumpStartTime >= MAX_PUMP_RUNTIME_MS)) {
    Serial.println("⚠️ Safety Alert: Maximum pump runtime exceeded! Auto-stopping pump.");
    stopPump("MAX_RUNTIME_EXCEEDED");
  }

  // 2. Safety Watchdog: dry-run tank level check
  if (isPumpRunning && !checkWaterAvailable()) {
    Serial.println("⚠️ Safety Alert: Water tank empty! Stopping pump immediately to prevent damage.");
    stopPump("TANK_EMPTY_INTERRUPT");
  }

  // 3. Periodic command polling from backend
  if (currentMillis - lastCommandPollTime >= COMMAND_POLL_INTERVAL_MS) {
    lastCommandPollTime = currentMillis;
    pollPendingCommands();
  }

  // 4. Periodic sensor reading and upload
  if (currentMillis - lastSensorPostTime >= SENSOR_POST_INTERVAL_MS) {
    lastSensorPostTime = currentMillis;
    readAndUploadSensors();
  }

  delay(50);
}

// -----------------------------------------------------------------------------
// Hardware Helper Functions
// -----------------------------------------------------------------------------
void connectWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi connected! IP address: " + WiFi.localIP().toString());
    digitalWrite(PIN_STATUS_LED, HIGH);
  } else {
    Serial.println("\n❌ Wi-Fi connection failed. Will retry in loop.");
    digitalWrite(PIN_STATUS_LED, LOW);
  }
}

bool checkWaterAvailable() {
  // Float switch connected with pullup: LOW when float is resting on water (available)
  return digitalRead(PIN_WATER_FLOAT) == LOW;
}

float readCalibratedMoisture() {
  int rawADC = analogRead(PIN_SOIL_ADC);
  // Constrain ADC within calibrated thresholds
  rawADC = constrain(rawADC, WATER_VALUE, AIR_VALUE);
  // Invert and map to 0-100 percentage
  int percent = map(rawADC, AIR_VALUE, WATER_VALUE, 0, 100);
  return (float)percent;
}

void startPump() {
  if (!checkWaterAvailable()) {
    Serial.println("❌ Cannot start pump: Water reservoir level is empty!");
    return;
  }
  digitalWrite(PIN_RELAY_PUMP, HIGH);
  isPumpRunning = true;
  pumpStartTime = millis();
  Serial.println("💧 Pump turned ON.");
}

void stopPump(const char* reason) {
  digitalWrite(PIN_RELAY_PUMP, LOW);
  isPumpRunning = false;
  pumpStartTime = 0;
  Serial.print("🛑 Pump turned OFF. Reason: ");
  Serial.println(reason);
}

// -----------------------------------------------------------------------------
// Cloud Communication Functions
// -----------------------------------------------------------------------------
void readAndUploadSensors() {
  float soilMoisture = readCalibratedMoisture();
  float temperature  = dht.readTemperature();
  float humidity     = dht.readHumidity();
  bool  waterAvail   = checkWaterAvailable();

  // Validate DHT readings
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor! Using fallback zero.");
    temperature = 25.0;
    humidity = 50.0;
  }

  Serial.printf("📊 Readings -> Moisture: %.1f%%, Temp: %.1f°C, Humidity: %.1f%%, Water: %s\n",
    soilMoisture, temperature, humidity, waterAvail ? "YES" : "NO");

  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // For production, configure certificate bundle

  HTTPClient http;
  String url = String(SERVER_BASE_URL) + "/sensor";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(DEVICE_SECRET));

  StaticJsonDocument<256> doc;
  doc["deviceId"]       = DEVICE_ID;
  doc["soilMoisture"]   = soilMoisture;
  doc["temperature"]    = temperature;
  doc["humidity"]       = humidity;
  doc["waterAvailable"] = waterAvail;

  String requestBody;
  serializeJson(doc, requestBody);

  int httpCode = http.POST(requestBody);
  if (httpCode == 200 || httpCode == 201) {
    Serial.println("✅ Sensor payload delivered to KrishiPulse backend.");
  } else {
    Serial.printf("❌ Sensor upload failed. HTTP code: %d\n", httpCode);
  }
  http.end();
}

void pollPendingCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String(SERVER_BASE_URL) + "/command?deviceId=" + String(DEVICE_ID);
  http.begin(client, url);
  http.addHeader("Authorization", "Bearer " + String(DEVICE_SECRET));

  int httpCode = http.GET();
  if (httpCode == 200) {
    String response = http.getString();
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error && doc["success"] == true && !doc["command"].isNull()) {
      String commandId = doc["command"]["commandId"].as<String>();
      String action    = doc["command"]["command"].as<String>();
      Serial.printf("📥 Claimed command: %s [%s]\n", commandId.c_str(), action.c_str());

      executeAndAcknowledge(commandId, action);
    }
  }
  http.end();
}

void executeAndAcknowledge(String commandId, String action) {
  String execStatus = "EXECUTED";
  String reason = "";

  if (action == "PUMP_ON") {
    if (!checkWaterAvailable()) {
      execStatus = "REJECTED";
      reason = "TANK_EMPTY";
      Serial.println("⛔ Command REJECTED by local ESP32 safety rule: Tank is empty.");
    } else {
      startPump();
    }
  } else if (action == "PUMP_OFF") {
    stopPump("USER_OR_AUTO_COMMAND");
  }

  // Send acknowledgement to backend
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String(SERVER_BASE_URL) + "/pump-ack";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(DEVICE_SECRET));

  StaticJsonDocument<256> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["commandId"]   = commandId;
  doc["status"]      = execStatus;
  doc["pumpStatus"]  = isPumpRunning ? "ON" : "OFF";
  if (reason.length() > 0) doc["reason"] = reason;

  String requestBody;
  serializeJson(doc, requestBody);
  http.POST(requestBody);
  http.end();

  Serial.println("📤 Acknowledgement sent to backend.");
}
