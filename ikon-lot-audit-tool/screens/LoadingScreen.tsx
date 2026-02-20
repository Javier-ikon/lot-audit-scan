
import React from 'react';
import { AuditSession } from '../types';
import { Card } from '../components/UIElements';

interface LoadingScreenProps {
  vin: string;
  session: AuditSession;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ vin, session }) => {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#CC0000] font-bold p-2 opacity-50">End Audit</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Scanned:</span>
          <span className="text-2xl font-bold">{session.scannedVehicles.length}</span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mb-4">{session.rooftop?.city} - {session.rooftop?.name}</p>

      <Card className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="w-20 h-20 border-8 border-gray-100 rounded-full"></div>
          <div className="w-20 h-20 border-8 border-t-[#0066CC] border-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Looking up vehicle...</h2>
          <p className="text-gray-500 font-mono tracking-tight text-lg mb-4">{vin}</p>
          <p className="text-sm text-gray-400 italic">Targeting less than 3 seconds...</p>
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;
