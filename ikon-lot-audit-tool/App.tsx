
import React, { useState, useEffect, useCallback } from 'react';
import { AppScreen, AuditSession, VehicleInfo, VehicleStatus, Rooftop } from './types';
import { MOCK_USER, ROOFTOPS } from './constants';
import { lookupVehicle, validateVIN } from './services/auditService';

// Screens
import LoginScreen from './screens/LoginScreen';
import RooftopSelectionScreen from './screens/RooftopSelectionScreen';
import StartAuditScreen from './screens/StartAuditScreen';
import ScanningScreen from './screens/ScanningScreen';
import LoadingScreen from './screens/LoadingScreen';
import StatusScreen from './screens/StatusScreen';
import ReportScreen from './screens/ReportScreen';
import SessionCompleteScreen from './screens/SessionCompleteScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [session, setSession] = useState<AuditSession>({
    rooftop: null,
    auditor: MOCK_USER,
    startDate: null,
    scannedVehicles: [],
  });
  const [lastScanResult, setLastScanResult] = useState<VehicleInfo | null>(null);
  const [currentLookupVin, setCurrentLookupVin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleLogin = () => setCurrentScreen(AppScreen.ROOFTOP_SELECTION);
  
  const handleRooftopSelect = (rooftop: Rooftop) => {
    setSession(prev => ({ ...prev, rooftop }));
    setCurrentScreen(AppScreen.START_AUDIT);
  };

  const handleStartAudit = () => {
    setSession(prev => ({ ...prev, startDate: new Date() }));
    setCurrentScreen(AppScreen.SCANNING);
  };

  const handleScan = async (vin: string) => {
    if (!validateVIN(vin)) {
      setError("Invalid VIN format. Must be 17 characters (A-Z, 0-9, no I/O/Q)");
      return;
    }
    setError(null);
    setCurrentLookupVin(vin);
    setCurrentScreen(AppScreen.LOADING);

    try {
      const result = await lookupVehicle(vin);
      setLastScanResult(result);
      if (result.status !== VehicleStatus.ERROR) {
        setSession(prev => ({
          ...prev,
          scannedVehicles: [...prev.scannedVehicles, result]
        }));
      }
      setCurrentScreen(AppScreen.STATUS_DISPLAY);
    } catch (e) {
      setError("Unable to connect to server. Check your network connection.");
      setCurrentScreen(AppScreen.STATUS_DISPLAY); // We treat lookup failure as a status display state or error state
    }
  };

  const handleEndAudit = () => {
    setCurrentScreen(AppScreen.REPORT);
  };

  const resetSession = () => {
    setSession({
      rooftop: null,
      auditor: MOCK_USER,
      startDate: null,
      scannedVehicles: [],
    });
    setLastScanResult(null);
    setCurrentScreen(AppScreen.LOGIN);
  };

  const startNewAudit = () => {
    setSession({
      rooftop: null,
      auditor: MOCK_USER,
      startDate: null,
      scannedVehicles: [],
    });
    setLastScanResult(null);
    setCurrentScreen(AppScreen.ROOFTOP_SELECTION);
  };

  // Simplified routing logic
  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case AppScreen.ROOFTOP_SELECTION:
        return <RooftopSelectionScreen 
          onSelect={handleRooftopSelect} 
          onBack={() => setCurrentScreen(AppScreen.LOGIN)}
        />;
      case AppScreen.START_AUDIT:
        return <StartAuditScreen 
          session={session} 
          onStart={handleStartAudit} 
          onBack={() => setCurrentScreen(AppScreen.ROOFTOP_SELECTION)} 
        />;
      case AppScreen.SCANNING:
        return <ScanningScreen 
          session={session} 
          onScan={handleScan} 
          onEndAudit={handleEndAudit} 
          lastScanned={lastScanResult}
          error={error}
        />;
      case AppScreen.LOADING:
        return <LoadingScreen vin={currentLookupVin} session={session} />;
      case AppScreen.STATUS_DISPLAY:
        return <StatusScreen 
          vehicle={lastScanResult} 
          session={session} 
          onNext={() => setCurrentScreen(AppScreen.SCANNING)} 
          onRetry={() => handleScan(currentLookupVin)}
        />;
      case AppScreen.REPORT:
        return <ReportScreen 
          session={session} 
          onDownload={() => setCurrentScreen(AppScreen.SESSION_COMPLETE)}
          onStartNew={startNewAudit}
        />;
      case AppScreen.SESSION_COMPLETE:
        return <SessionCompleteScreen 
          onDone={resetSession} 
          onStartNew={startNewAudit} 
        />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] overflow-y-auto">
      {renderScreen()}
    </div>
  );
};

export default App;
