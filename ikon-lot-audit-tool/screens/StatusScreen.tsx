
import React from 'react';
import { VehicleInfo, VehicleStatus, AuditSession } from '../types';
import { Button, Card } from '../components/UIElements';

interface StatusScreenProps {
  vehicle: VehicleInfo | null;
  session: AuditSession;
  onNext: () => void;
  onRetry: () => void;
}

const StatusScreen: React.FC<StatusScreenProps> = ({ vehicle, session, onNext, onRetry }) => {
  if (!vehicle) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 font-bold mb-4">An error occurred during lookup.</p>
        <Button onClick={onNext}>Return to Scan</Button>
      </div>
    );
  }

  const getStatusConfig = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.OK:
        return {
          icon: '✅',
          color: '#00AA00',
          title: 'OK',
          descColor: 'text-gray-500'
        };
      case VehicleStatus.NEEDS_ATTENTION:
        return {
          icon: '⚠️',
          color: '#FF9900',
          title: 'Needs Attention',
          descColor: 'text-gray-700 font-medium'
        };
      case VehicleStatus.NOT_FOUND:
        return {
          icon: '❌',
          color: '#CC0000',
          title: 'Not Found',
          descColor: 'text-gray-700'
        };
      default:
        return {
          icon: '⚠️',
          color: '#CC0000',
          title: 'Lookup Failed',
          descColor: 'text-red-600'
        };
    }
  };

  const config = getStatusConfig(vehicle.status);

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

      <Card 
        className="flex-1 flex flex-col items-center py-10" 
        border={config.color}
      >
        <div className="text-7xl mb-4">{config.icon}</div>
        <h2 className="text-4xl font-bold mb-4 uppercase" style={{ color: config.color }}>{config.title}</h2>
        
        <p className={`text-center px-6 mb-8 text-lg ${config.descColor}`}>
          {vehicle.description}
        </p>

        <div className="w-full border-t border-gray-100 my-4"></div>

        <div className="w-full space-y-4 px-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-gray-400 uppercase">VIN</span>
            <span className="font-mono font-bold text-gray-800">{vehicle.vin}</span>
          </div>
          {vehicle.imei && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-400 uppercase">IMEI</span>
              <span className="font-mono font-bold text-gray-800">{vehicle.imei}</span>
            </div>
          )}
          {vehicle.dealer && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-400 uppercase">Dealer</span>
              <span className="font-bold text-gray-800">{vehicle.dealer}</span>
            </div>
          )}
          {vehicle.lastReport && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-400 uppercase">Last Report</span>
              <span className="text-gray-500">{vehicle.lastReport}</span>
            </div>
          )}
          {vehicle.issue && (
            <div className="flex justify-between items-baseline p-2 bg-orange-50 rounded border border-orange-100">
              <span className="text-xs font-bold text-orange-600 uppercase">Issue</span>
              <span className="font-bold text-orange-600">{vehicle.issue}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 pb-4 flex flex-col gap-3">
        {vehicle.status === VehicleStatus.ERROR ? (
          <>
            <Button onClick={onRetry}>Retry Lookup</Button>
            <Button variant="outline" onClick={onNext}>Skip Vehicle</Button>
          </>
        ) : (
          <Button onClick={onNext}>Next Vehicle</Button>
        )}
      </div>
    </div>
  );
};

export default StatusScreen;
