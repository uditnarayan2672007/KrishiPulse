import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LiveSensors } from './pages/LiveSensors';
import { IrrigationControl } from './pages/IrrigationControl';
import { DeviceManagement } from './pages/DeviceManagement';
import { Analytics } from './pages/Analytics';
import { MLRecommendations } from './pages/MLRecommendations';
import { Settings } from './pages/Settings';

export const App = () => {
  return (
    <AuthProvider>
      <DeviceProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Dashboard Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sensors" element={<LiveSensors />} />
              <Route path="/irrigation" element={<IrrigationControl />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ml" element={<MLRecommendations />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DeviceProvider>
    </AuthProvider>
  );
};

export default App;
