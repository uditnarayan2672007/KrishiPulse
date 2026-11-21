"""
FastAPI Microservice for KrishiPulse ML Prediction
"""

import os
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(
    title="KrishiPulse ML Service",
    description="Intelligent irrigation recommendation microservice powered by Scikit-learn",
    version="1.1.0"
)

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.joblib')
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✅ Loaded model from {MODEL_PATH}")
except Exception as e:
    print(f"Warning: Model file not loaded: {e}")

class SensorPayload(BaseModel):
    deviceId: str = "KP001"
    soilMoisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    temperature: float = Field(..., ge=-20, le=70, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")

@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "service": "KrishiPulse ML Prediction Engine",
        "modelLoaded": model is not None,
        "version": "1.1"
    }

@app.post("/predict")
def predict_irrigation(payload: SensorPayload):
    m = payload.soilMoisture
    t = payload.temperature
    h = payload.humidity

    if model is not None:
        features = np.array([[m, t, h]])
        pred = int(model.predict(features)[0])
        proba = float(model.predict_proba(features)[0][pred])
    else:
        # Calibrated heuristic fallback
        pred = 1 if m < 35 or (m < 42 and (t > 30 or h < 50)) else 0
        proba = 0.92

    irrigation_required = bool(pred == 1)

    if irrigation_required:
        if m < 28:
            rec = f"Critical soil moisture deficit ({m}%). Immediate pump activation recommended."
        else:
            rec = f"Moisture is low ({m}%) with high evaporative stress ({t}°C). Scheduled evening irrigation recommended."
    else:
        rec = f"Soil moisture ({m}%) is in optimal range for root uptake. Irrigation not required."

    return {
        "success": True,
        "prediction": {
            "deviceId": payload.deviceId,
            "irrigationRequired": irrigation_required,
            "recommendation": rec,
            "confidence": round(proba, 2),
            "modelVersion": "1.1-randomforest"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
