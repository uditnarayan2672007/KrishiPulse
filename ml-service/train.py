"""
KrishiPulse - Soil Irrigation Prediction Training Pipeline
Uses Scikit-Learn to train and evaluate a Decision Tree & Random Forest Classifier.
Features: soil_moisture (%), temperature (°C), humidity (%)
Target: irrigation_required (0 = No, 1 = Yes)
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def generate_agricultural_dataset(samples=2000, random_seed=42):
    np.random.seed(random_seed)
    # Soil moisture: 10% to 80%
    soil_moisture = np.random.uniform(10.0, 80.0, samples)
    # Ambient Temperature: 15°C to 45°C
    temperature = np.random.uniform(15.0, 45.0, samples)
    # Humidity: 20% to 95%
    humidity = np.random.uniform(20.0, 95.0, samples)

    # Irrigation rule logic:
    # 1. Moisture < 30%: Always requires water
    # 2. Moisture 30% - 42%: Requires water if high temp (> 30°C) or low humidity (< 50%)
    # 3. Moisture > 42%: Does not require water
    irrigation_required = []
    for m, t, h in zip(soil_moisture, temperature, humidity):
        if m < 30.0:
            irrigation_required.append(1)
        elif 30.0 <= m <= 42.0:
            if t > 30.0 or h < 50.0:
                irrigation_required.append(1)
            else:
                irrigation_required.append(0)
        else:
            irrigation_required.append(0)

    # Add slight 2% realistic sensor measurement noise
    noise_idx = np.random.choice(samples, size=int(samples * 0.02), replace=False)
    for idx in noise_idx:
        irrigation_required[idx] = 1 - irrigation_required[idx]

    df = pd.DataFrame({
        'soil_moisture': np.round(soil_moisture, 2),
        'temperature': np.round(temperature, 2),
        'humidity': np.round(humidity, 2),
        'irrigation_required': irrigation_required
    })
    return df

def train_model():
    print("🌾 Generating agricultural training dataset...")
    df = generate_agricultural_dataset(3000)

    X = df[['soil_moisture', 'temperature', 'humidity']]
    y = df['irrigation_required']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Dataset split: {len(X_train)} training samples, {len(X_test)} evaluation samples.")

    # 1. Train Decision Tree baseline
    dt = DecisionTreeClassifier(max_depth=5, random_state=42)
    dt.fit(X_train, y_train)
    dt_acc = accuracy_score(y_test, dt.predict(X_test))
    print(f"Decision Tree Accuracy: {dt_acc * 100:.2f}%")

    # 2. Train Random Forest (Production model)
    rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"Random Forest Accuracy: {rf_acc * 100:.2f}%")
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, rf_preds, target_names=['No Irrigation', 'Irrigation Needed']))

    # Save trained model artifact
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, 'model.joblib')
    joblib.dump(rf, model_path)
    print(f"✅ Model successfully saved to {model_path}")

if __name__ == '__main__':
    train_model()
