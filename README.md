# 🌱 KrishiPulse – Smart Agriculture & Water Management System

An intelligent IoT and Machine Learning-powered smart agriculture platform designed to monitor soil parameters, automate irrigation, conserve water, and boost agricultural productivity.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Environment Configuration](#-environment-configuration)
- [MongoDB Atlas Collections](#-mongodb-atlas-collections)
- [Serverless API Endpoints](#-serverless-api-endpoints)
- [Hardware Integration (ESP32)](#-hardware-integration-esp32)
- [Machine Learning Service](#-machine-learning-service)
- [Automated Testing](#-automated-testing)
- [Deployment on Vercel](#-deployment-on-vercel)

---

## 🌾 Overview

Traditional agricultural practices frequently lead to over-irrigation, resource depletion, and crop stress due to lack of real-time telemetry. **KrishiPulse** solves this challenge through:

1. **Continuous Telemetry**: Real-time monitoring of calibrated soil moisture (%), ambient temperature (°C), relative humidity (%), and water reservoir availability.
2. **Dual Irrigation Control**: Instant manual pump actuation with hardware handshakes alongside an autonomous AI mode.
3. **Machine Learning Advisory**: Scikit-learn predictive model evaluating evaporative stress and soil hydration to calculate precise irrigation recommendations.
4. **Interactive 3D WebGL Digital Twins**: High-fidelity Three.js 3D models embedded in the interface (Interactive Sprouting Cyber-Crop with laser scanner, ESP32 board digital twin with water particle streams, Volumetric Soil Strata layer cube).
5. **Isometric 3D Cutout Artwork**: High-relief 3D hardware & sensor architecture showcase in the Obsidian Black, Chrome Silver, and Laser Crimson design language.
6. **Safety Interlocks**: Automatic pump cutoffs based on reservoir low-water conditions, maximum 10-minute continuous runtime protection, and command lease expiry.
7. **High-Fidelity Simulated Fallback**: Fully functional out of the box with simulated sensor data, allowing frontend and backend workflows to run seamlessly before physical ESP32 hardware is connected.

---

## 🏗️ System Architecture

```
                    FARMER / OPERATOR
                           │
                           ▼
               ┌───────────────────────┐
               │   REACT 18 + VITE     │
               │ Tailwind CSS, Recharts│
               └───────────┬───────────┘
                           │ HTTPS REST
                           ▼
               ┌───────────────────────┐
               │    NODE.JS BACKEND    │
               │   Vercel Serverless   │
               └───────┬─────────┬─────┘
                       │         │
          ┌────────────┴───┐ ┌───┴────────────┐
          ▼                ▼ ▼                ▼
┌──────────────────┐ ┌───────────────┐ ┌──────────────────┐
│  SUPABASE AUTH   │ │ MONGODB ATLAS │ │PYTHON ML SERVICE │
│ Authentication & │ │ 6 Collections │ │Scikit-Learn Model│
│ JWT Tokens Only  │ │  Persistence  │ │  FastAPI Server  │
└──────────────────┘ └───────────────┘ └──────────────────┘
                            ▲
                            │ Polling (2-5s) / Post (15s)
                    ┌───────┴───────┐
                    │ ESP32 IOT NODE│
                    │ DHT11, Soil,  │
                    │ Float & Relay │
                    └───────┬───────┘
                            ▼
                    WATER PUMP & CROP
```

---

## 🛠️ Technology Stack

| Layer | Approved Technology | Function |
|---|---|---|
| **Frontend** | React.js 18 + Vite | Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Modern agricultural dark UI design |
| **Icons** | Lucide React | High quality UI icons |
| **Charts** | Recharts | Real-time & historical time-series analytics |
| **Routing** | React Router v6 | Page navigation and protected routing |
| **Backend** | Node.js (Vercel Serverless) | Event-driven serverless REST APIs |
| **Database** | MongoDB Atlas (Mongoose) | Primary document datastore (6 collections) |
| **Authentication** | Supabase Auth | User signups, sign-ins, and JWT issuance |
| **Hardware** | ESP32 (Arduino C++) | Capacitive Soil Sensor, DHT11, Float switch, Relay |
| **Machine Learning**| Python / Scikit-Learn | Random Forest & Decision Tree irrigation prediction |
| **Hosting** | Vercel | Seamless frontend & serverless API deployment |

---

## 📁 Project Directory Structure

```
KrishiPulse/
├── api/                   # Vercel Serverless API Functions
│   ├── analytics.js       # Aggregated sensor & irrigation analytics
│   ├── command.js         # ESP32 command polling & atomic leasing
│   ├── dashboard.js       # Main dashboard aggregate endpoint
│   ├── health.js          # System health check
│   ├── pump-ack.js        # ESP32 hardware execution acknowledgement
│   ├── device/            # Device registration and list endpoints
│   ├── irrigation/        # Historical irrigation event logs
│   ├── ml/                # ML prediction & history endpoints
│   ├── pump/              # Pump actuation and confirmed status
│   ├── sensor/            # Sensor ingestion & time-series retrieval
│   └── users/             # User profile synchronization
├── hardware/
│   └── esp32/
│       └── krishipulse.ino # ESP32 Arduino firmware with safety interlocks
├── lib/                   # Serverless helper modules
│   ├── auth.js            # Supabase JWT token verification
│   ├── device-auth.js     # ESP32 device secret authentication
│   ├── mongodb.js         # Cached Mongoose connection for serverless
│   ├── supabase.js        # Server-side Supabase client
│   └── validation.js      # Input validation logic
├── ml-service/            # Python Machine Learning microservice
│   ├── app.py             # FastAPI prediction microservice
│   ├── requirements.txt   # Python dependencies
│   └── train.py           # Synthetic dataset generator & model trainer
├── models/                # Mongoose Document Models
│   ├── Device.js          # ESP32 hardware registry
│   ├── IrrigationHistory.js # Completed pump cycles
│   ├── MLPrediction.js    # Model recommendation history
│   ├── PumpCommand.js     # Command queue & lifecycle status
│   ├── SensorReading.js   # IoT sensor time-series data
│   └── User.js            # User profile tied to Supabase authUserId
├── src/                   # React Frontend Source
│   ├── components/        # ThreeHeroModel, ThreeESP32Model, ThreeSoilStrataModel, MetricCard, Sidebar, Topbar
│   ├── context/           # AuthContext, DeviceContext
│   ├── layouts/           # DashboardLayout
│   ├── pages/             # 9 Complete Production Pages
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DeviceManagement.jsx
│   │   ├── IrrigationControl.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LiveSensors.jsx
│   │   ├── Login.jsx
│   │   ├── MLRecommendations.jsx
│   │   ├── Register.jsx
│   │   └── Settings.jsx
│   ├── services/          # Unified API client & simulated data engine
│   ├── App.jsx            # Router configuration
│   └── main.jsx           # React DOM root
├── package.json
├── tailwind.config.js
├── test-apis.js           # Automated regression API test suite
├── vercel.json            # Vercel deployment routing specification
└── vite.config.js
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (LTS 18+)
- **Git**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/KrishiPulse.git
cd KrishiPulse

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The application defaults to **Simulated Telemetry Mode** out of the box with rich simulated sensor data and full functionality, requiring zero initial external setup to test and explore!

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Frontend public environment variables (Vite)
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend secrets (Serverless API only - never exposed to browser)
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-key
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/krishipulse?retryWrites=true&w=majority

# Hardware pre-shared authentication secret
DEVICE_AUTH_SECRET=your-secure-device-pre-shared-secret

# Separately hosted Machine Learning service (optional)
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_API_KEY=your-ml-api-key
```

---

## 🗄️ MongoDB Atlas Collections

1. **`users`**: Profiles synchronized from Supabase authentication (`authUserId`, `fullName`, `email`, `role`).
2. **`devices`**: Registered ESP32 devices (`deviceId`, `deviceName`, `connectionStatus`, `lastSeen`, `pumpStatus`, `operatingMode`).
3. **`sensor_readings`**: Incoming telemetry (`deviceId`, `soilMoisture`, `temperature`, `humidity`, `waterAvailable`, `recordedAt`).
4. **`pump_commands`**: Command state machine queue (`deviceId`, `command`, `operatingMode`, `commandStatus` [PENDING, CLAIMED, EXECUTED, FAILED, EXPIRED, REJECTED], `expiresAt`).
5. **`irrigation_history`**: Completed physical irrigation cycles (`deviceId`, `startTime`, `endTime`, `durationSeconds`, `status`, `stopReason`).
6. **`ml_predictions`**: Model advisory logs (`deviceId`, `irrigationRequired`, `recommendation`, `confidence`, `modelVersion`).

---

## 🧪 Automated Testing

Verify all 7 serverless API endpoint suites:

```bash
npm test
```

Build the production frontend bundle:

```bash
npm run build
```

---

## 🔌 Hardware Integration (ESP32)

Open `hardware/esp32/krishipulse.ino` in Arduino IDE:
1. Update `WIFI_SSID` and `WIFI_PASSWORD`.
2. Configure `SERVER_BASE_URL` with your deployed Vercel URL.
3. Configure `DEVICE_SECRET` matching your provisioned hardware token.
4. Upload to ESP32 Dev Board.
5. Connect capacitive sensor to `GPIO 34`, DHT11 to `GPIO 4`, float switch to `GPIO 25`, and relay module to `GPIO 26`.

---

## 🤖 Machine Learning Service

To run the Python ML microservice:

```bash
cd ml-service
pip install -r requirements.txt
python train.py
uvicorn app:app --reload --port 8000
```

---

## 🌐 Deployment on Vercel

1. Push your repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com).
3. Set Framework to **Vite** with Root Directory `./`.
4. Add the environment variables specified in `.env.example`.
5. Deploy! Vercel automatically deploys the React frontend and compiles `/api/*` into serverless functions.
