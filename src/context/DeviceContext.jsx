import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState('KP001');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatedMode, setIsSimulatedMode] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Load available devices
  const refreshDevices = async () => {
    try {
      const list = await apiClient.getDevices();
      setDevices(list);
      if (list.length > 0 && !list.find((d) => d.deviceId === activeDeviceId)) {
        setActiveDeviceId(list[0].deviceId);
      }
    } catch (err) {
      console.error('Failed to load devices:', err);
    }
  };

  // Poll latest telemetry
  const refreshDashboard = async () => {
    if (!activeDeviceId) return;
    try {
      const res = await apiClient.getDashboard(activeDeviceId);
      if (res?.dashboard) {
        setDashboardData(res);
        setIsSimulatedMode(Boolean(res.isSimulated));
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDevices();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    refreshDashboard();
    // Poll every 5 seconds per PRD & TechStack specifications
    const interval = setInterval(() => {
      refreshDashboard();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeDeviceId]);

  // Command execution
  const togglePump = async (command, mode = 'MANUAL') => {
    try {
      const res = await apiClient.sendPumpCommand(activeDeviceId, command, mode);
      await refreshDashboard();
      return res;
    } catch (err) {
      console.error('Error sending pump command:', err);
      throw err;
    }
  };

  const activeDevice = devices.find((d) => d.deviceId === activeDeviceId) || devices[0];

  return (
    <DeviceContext.Provider
      value={{
        devices,
        activeDeviceId,
        setActiveDeviceId,
        activeDevice,
        dashboardData,
        isLoading,
        isSimulatedMode,
        lastRefreshed,
        refreshDashboard,
        refreshDevices,
        togglePump,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
