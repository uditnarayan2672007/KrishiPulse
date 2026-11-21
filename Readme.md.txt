
🌱 KrishiPulse – Smart Agriculture & Water Management System
An IoT and Machine Learning-powered smart agriculture platform designed to optimize irrigation, conserve water, and improve agricultural resource management.






________________________________________
📌 Table of Contents
•	Overview
•	Problem Statement
•	Objectives
•	Key Features
•	Technology Stack
•	System Architecture
•	Hardware Components
•	Database Structure
•	API Endpoints
•	Project Structure
•	Getting Started
•	Environment Variables
•	Application Workflow
•	Security
•	Development Roadmap
•	Future Enhancements
•	Contributing
•	License
________________________________________
🌾 Overview
KrishiPulse is a Smart Agriculture and Water Management System that integrates Internet of Things (IoT), Machine Learning (ML), and modern web technologies to make agricultural irrigation smarter and more efficient.
The platform collects real-time agricultural data using ESP32-connected sensors, processes and stores the information in MongoDB Atlas, and displays it through an interactive web dashboard.
Using Machine Learning, KrishiPulse aims to analyze soil and environmental conditions to generate intelligent irrigation recommendations.
Farmers can monitor their agricultural environment, view historical data, and remotely manage irrigation operations through a web-based application.
🎯 Our Vision
To make agriculture more intelligent, affordable, efficient, and sustainable by combining IoT-based monitoring, automated irrigation, and data-driven decision-making.
________________________________________
🚨 Problem Statement
Traditional agricultural practices often result in excessive water consumption, inefficient irrigation, and poor resource management.
Farmers frequently lack access to real-time information about soil moisture, temperature, humidity, and water availability. This can lead to unnecessary irrigation, increased operational effort, and inefficient agricultural productivity.
KrishiPulse addresses these challenges through real-time monitoring, intelligent irrigation recommendations, and remote water management.
________________________________________
🎯 Objectives
•	Monitor soil moisture, temperature, and humidity in real time.
•	Reduce unnecessary water consumption.
•	Enable remote irrigation management.
•	Provide manual and automatic pump control.
•	Generate intelligent irrigation recommendations using Machine Learning.
•	Maintain historical sensor and irrigation records.
•	Provide a centralized and user-friendly agricultural dashboard.
•	Improve agricultural resource management through IoT technology.
________________________________________
✨ Key Features
📊 Smart Dashboard
•	Real-time soil moisture monitoring.
•	Temperature and humidity monitoring.
•	Water tank availability status.
•	Pump operating status.
•	ESP32 device connectivity monitoring.
•	Irrigation mode indicators.
•	Machine Learning recommendations.
🌱 IoT-Based Monitoring
•	ESP32-based hardware communication.
•	Automatic sensor data collection.
•	Secure data transmission through HTTPS REST APIs.
•	Historical sensor data storage.
•	Remote monitoring through the web dashboard.
💧 Smart Irrigation Management
•	Manual pump ON/OFF control.
•	Automatic irrigation mode.
•	Remote irrigation commands.
•	Hardware command acknowledgements.
•	Water availability protection.
•	Pump runtime safety limits.
🤖 Machine Learning Integration
•	Analyze soil and environmental conditions.
•	Predict irrigation requirements.
•	Generate irrigation recommendations.
•	Store historical ML predictions.
•	Support future crop-specific recommendations.
📈 Analytics & History
•	Historical soil moisture graphs.
•	Temperature and humidity trends.
•	Irrigation history.
•	Pump runtime tracking.
•	Agricultural data analysis.
🔐 Authentication & Security
•	User registration and login.
•	Supabase-based authentication.
•	Protected dashboard access.
•	Device-specific authentication.
•	Secure backend API communication.
________________________________________
🛠️ Technology Stack
Layer	Technology	Purpose
Frontend	React.js	User interface
Styling	Tailwind CSS	Responsive UI
Routing	React Router	Application navigation
Backend	Node.js	Server-side application logic
API	REST API	Frontend and hardware communication
Authentication	Supabase Auth	User authentication
Database	MongoDB Atlas	Application data storage
ODM	Mongoose	MongoDB schema and queries
Deployment	Vercel	Frontend and backend hosting
Hardware	ESP32	IoT controller
Programming	Arduino IDE / C++	ESP32 programming
Communication	HTTPS	Hardware and backend communication
Machine Learning	Python / Scikit-learn	Irrigation prediction
Data Visualization	Recharts	Charts and analytics
Version Control	Git / GitHub	Source code management
Architecture decision: Supabase is used exclusively for authentication. MongoDB Atlas is the primary database for all application data.
________________________________________
🏗️ System Architecture
KrishiPulse follows a client-server architecture with IoT hardware integration.
                   FARMER / USER
                         |
                         v
              +----------------------+
              |   REACT.JS FRONTEND  |
              |                      |
              | Dashboard            |
              | Analytics            |
              | Irrigation Controls  |
              +----------------------+
                         |
                    HTTPS REST API
                         |
                         v
              +----------------------+
              |   NODE.JS BACKEND    |
              |                      |
              | API Routes           |
              | Business Logic       |
              | Validation           |
              | Authorization        |
              +----------------------+
                    /          \
                   /            \
                  v              v
        +----------------+  +----------------+
        | SUPABASE AUTH  |  | MONGODB ATLAS  |
        |                |  |                |
        | User Login     |  | User Profiles  |
        | Registration   |  | Sensor Data    |
        | Sessions       |  | Devices        |
        | Access Tokens  |  | Pump Commands  |
        +----------------+  | ML Predictions |
                            +----------------+
                                   |
                                   v
                         +-------------------+
                         | PYTHON ML SERVICE |
                         |                   |
                         | Irrigation Model  |
                         | Predictions       |
                         +-------------------+

                                   |
                                   v
                         +-------------------+
                         |   ESP32 HARDWARE  |
                         |                   |
                         | Soil Sensor       |
                         | DHT11 Sensor      |
                         | Water Level       |
                         | Relay Module      |
                         +-------------------+
                                   |
                                   v
                              WATER PUMP
🔄 Data Communication Workflow
Sensor monitoring:
1.	Sensors collect agricultural data.
2.	ESP32 reads and processes the sensor values.
3.	ESP32 sends readings to the Node.js backend through HTTPS.
4.	Backend validates the incoming data.
5.	MongoDB Atlas stores the readings.
6.	React retrieves the latest information.
7.	Dashboard displays the sensor values.
Irrigation control:
1.	User requests pump operation through the dashboard.
2.	Backend verifies user authentication and device permissions.
3.	Backend stores the command in MongoDB.
4.	ESP32 periodically checks for pending commands.
5.	ESP32 validates the command and checks local safety conditions.
6.	Relay activates or deactivates the pump.
7.	ESP32 sends an acknowledgement.
8.	Backend updates the command status.
9.	Dashboard displays the confirmed pump state.
Deployment: Vercel hosts the React frontend and Node.js serverless API routes. MongoDB Atlas, Supabase Auth, and the Python ML service operate as separate connected services.
________________________________________
🔌 Hardware Components
Component	Purpose
ESP32 Development Board	Main IoT controller
Capacitive Soil Moisture Sensor	Soil moisture measurement
DHT11 Sensor	Temperature and humidity measurement
Water Level Float Switch	Water availability detection
Single-Channel Relay Module	Pump switching
Mini DC Water Pump	Irrigation
Power Supply	Power for hardware
Breadboard and Jumper Wires	Circuit connections
Water Pipe	Water transportation
Hardware safety: The water pump must use a suitable separate power supply and an appropriate relay or driver. Do not power the pump directly from an ESP32 GPIO pin. Include local pump timeout and water-level protection. The prototype is designed around low-voltage DC hardware.
________________________________________
🗄️ Database Structure
KrishiPulse uses MongoDB Atlas with six primary collections.
Collection	Description
users	Application user profiles
devices	Registered ESP32 devices
sensor_readings	Historical sensor readings
pump_commands	Pump operation commands
irrigation_history	Actual irrigation events
ml_predictions	Machine Learning predictions
Database Relationships
•	One user can own multiple devices.
•	One device can generate multiple sensor readings.
•	One device can receive multiple pump commands.
•	One device can have multiple irrigation records.
•	One device can generate multiple ML predictions.
•	Sensor readings can be referenced by ML predictions.
Supabase Auth manages authentication identities. The corresponding Supabase user ID is stored in the MongoDB user profile.
________________________________________
🔗 API Endpoints
The backend uses Node.js REST APIs.
Base URL – Development
http://localhost:3000/api
Base URL – Production
https://your-project.vercel.app/api
User APIs
Method	Endpoint	Description
POST	/users/sync	Synchronize user profile
GET	/users/me	Get current user profile
Device APIs
Method	Endpoint	Description
POST	/device/register	Register ESP32
GET	/device	List registered devices
GET	/device/:deviceId	Get device details
DELETE	/device/:deviceId	Remove device
Sensor APIs
Method	Endpoint	Description
POST	/sensor	Receive sensor readings
GET	/sensor/latest	Get latest sensor readings
GET	/sensor/history	Get historical readings
Dashboard API
Method	Endpoint	Description
GET	/dashboard	Get dashboard information
Irrigation APIs
Method	Endpoint	Description
POST	/pump	Create pump command
GET	/pump/status	Get confirmed pump status
GET	/command	ESP32 retrieves pending command
POST	/pump-ack	Receive command acknowledgement
GET	/irrigation/history	Retrieve irrigation history
Analytics APIs
Method	Endpoint	Description
GET	/analytics	Retrieve agricultural analytics
Machine Learning APIs
Method	Endpoint	Description
POST	/ml/predict	Generate irrigation prediction
GET	/ml/history	Retrieve prediction history
System API
Method	Endpoint	Description
GET	/health	Check backend health
All protected user endpoints require a valid Supabase access token. Hardware endpoints use separate device credentials.
________________________________________
📁 Project Structure
KrishiPulse/
│
├── api/
│   ├── users/
│   ├── device/
│   ├── sensor/
│   ├── pump/
│   ├── irrigation/
│   ├── ml/
│   ├── dashboard.js
│   ├── command.js
│   ├── pump-ack.js
│   ├── analytics.js
│   └── health.js
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── lib/
│   ├── mongodb.js
│   ├── supabase.js
│   ├── auth.js
│   ├── device-auth.js
│   └── validation.js
│
├── models/
│   ├── User.js
│   ├── Device.js
│   ├── SensorReading.js
│   ├── PumpCommand.js
│   ├── IrrigationHistory.js
│   └── MLPrediction.js
│
├── ml-service/
│   ├── dataset/
│   ├── models/
│   ├── train.py
│   ├── predict.py
│   ├── app.py
│   └── requirements.txt
│
├── hardware/
│   └── esp32/
│       └── krishipulse.ino
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
Note: This is the planned repository structure. Actual folders and files will be added as development progresses.
________________________________________
🚀 Getting Started
Follow these instructions to run the software locally.
Prerequisites
Install or create the following:
•	Node.js (LTS version)
•	npm
•	Git
•	MongoDB Atlas account
•	Supabase account
•	GitHub account
•	Vercel account
For hardware development, Arduino IDE and the ESP32 board support package will also be required.
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/KrishiPulse.git

cd KrishiPulse
Replace YOUR_USERNAME with your GitHub username and use your actual repository URL.
2. Install Dependencies
npm install
3. Configure MongoDB Atlas
1.	Create a MongoDB Atlas account.
2.	Create a cluster.
3.	Create a database user.
4.	Configure network access securely.
5.	Obtain the MongoDB connection string.
6.	Add the connection string to your environment variables.
Create a database named:
krishipulse
4. Configure Supabase Authentication
1.	Create a Supabase project.
2.	Open the Authentication section.
3.	Configure your required sign-in method.
4.	Obtain the project URL and publishable/anon key.
5.	Configure the allowed redirect URLs for local and deployed applications.
Supabase is used only for authentication.
5. Configure Environment Variables
Create a .env file in the project root.
# Frontend configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Backend configuration
SUPABASE_URL=
SUPABASE_SECRET_KEY=
MONGODB_URI=

# Hardware authentication
DEVICE_AUTH_SECRET=

# Machine Learning service
ML_SERVICE_URL=
ML_SERVICE_API_KEY=
Security note: Never commit .env to GitHub. The VITE_ variables are exposed to the browser, so they must contain only public configuration values. All secrets must be server-side.
6. Start Development Server
npm run dev
Open the local URL displayed by Vite in your browser.
The exact development command will depend on the final Vite and Vercel configuration.
7. Deploy on Vercel
1.	Push the project to GitHub.
2.	Open Vercel.
3.	Import the GitHub repository.
4.	Configure the project build settings.
5.	Add production environment variables.
6.	Deploy the application.
7.	Configure Supabase's allowed production redirect URLs.
After deployment, the application will be accessible through its Vercel URL.
________________________________________
🔐 Security
KrishiPulse follows these security practices:
•	Supabase Auth for user authentication.
•	Server-side verification of user access tokens.
•	Device-specific authentication credentials.
•	HTTPS-based API communication.
•	Secure MongoDB connection strings.
•	Input validation for sensor data.
•	User-to-device ownership authorization.
•	Pump command expiry and acknowledgement.
•	Local hardware safety checks.
•	Rate limiting for sensitive APIs.
The ESP32 must independently enforce pump safety conditions, including water availability and maximum operating time. Network connectivity must not be the only safety mechanism.
________________________________________
🔄 Application Workflow
Phase 1 – Frontend Development
Develop the React dashboard with simulated sensor readings and responsive UI.
Phase 2 – Authentication
Integrate Supabase Auth for user registration, login, and protected access.
Phase 3 – Backend & Database
Develop Node.js APIs and connect MongoDB Atlas using Mongoose.
Phase 4 – Machine Learning
Prepare agricultural datasets, train the model, evaluate its performance, and integrate the prediction service.
Phase 5 – Deployment
Deploy the frontend and backend APIs on Vercel.
Phase 6 – Hardware Integration
Connect ESP32, sensors, relay module, and DC water pump to the deployed backend.
Phase 7 – Testing
Test sensor transmission, irrigation control, device connectivity, ML recommendations, and hardware safety.
________________________________________
🗺️ Development Roadmap
•	React frontend foundation
•	Responsive dashboard UI
•	Supabase authentication
•	MongoDB Atlas integration
•	Mongoose database models
•	Node.js REST APIs
•	Simulated sensor data integration
•	Device registration and authentication
•	Pump command management
•	Irrigation history and analytics
•	Machine Learning model development
•	ML prediction API integration
•	Vercel deployment
•	ESP32 programming
•	Sensor integration
•	Pump and relay integration
•	End-to-end testing
________________________________________
🔮 Future Enhancements
•	Weather API integration.
•	Crop-specific irrigation recommendations.
•	Multiple field and device management.
•	Advanced Machine Learning models.
•	Water consumption estimation.
•	Smart irrigation scheduling.
•	Mobile application.
•	MQTT-based IoT communication.
•	Advanced agricultural analytics.
________________________________________
🤝 Contributing
Contributions, suggestions, and improvements are welcome.
If you want to contribute:
1.	Fork the repository.
2.	Create a feature branch.
3.	Make your changes.
4.	Test your implementation.
5.	Submit a pull request.
git checkout -b feature/your-feature-name

git add .

git commit -m "Add: your feature description"

git push origin feature/your-feature-name
________________________________________
📄 License
This project is currently under development.
A license has not yet been selected. Please check the repository for licensing information before reusing or distributing the source code.
________________________________________
🌱 Project Information
Project Name: KrishiPulse
Project Category: Smart Agriculture / IoT / Machine Learning
Department: Computer Science and Engineering
Core Technologies: React.js, Node.js, MongoDB Atlas, Supabase Auth, ESP32, Python, Scikit-learn.
Deployment Platform: Vercel
________________________________________
Building a Smarter and More Sustainable Agricultural Future.
KrishiPulse – Smart Farming. Smarter Irrigation. Better Tomorrow. 🌱

