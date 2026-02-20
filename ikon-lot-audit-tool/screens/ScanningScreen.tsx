
import React, { useState } from 'react';
import { AuditSession, VehicleInfo, VehicleStatus } from '../types';
import { Button, Input, Card } from '../components/UIElements';

interface ScanningScreenProps {
  session: AuditSession;
  onScan: (vin: string) => void;
  onEndAudit: () => void;
  lastScanned: VehicleInfo | null;
  error: string | null;
}

const ScanningScreen: React.FC<ScanningScreenProps> = ({ session, onScan, onEndAudit, lastScanned, error }) => {
  const [manualVin, setManualVin] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleSubmit = () => {
    if (manualVin) {
      onScan(manualVin.toUpperCase().trim());
      setManualVin('');
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.OK: return <span className="text-green-600">✅ OK</span>;
      case VehicleStatus.NEEDS_ATTENTION: return <span className="text-orange-500">⚠️ NEEDS ATTENTION</span>;
      case VehicleStatus.NOT_FOUND: return <span className="text-red-600">❌ NOT FOUND</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setShowEndConfirm(true)} className="text-[#CC0000] font-bold p-2 uppercase tracking-wide">
          End Audit
        </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Scanned:</span>
          <span className="text-2xl font-bold">{session.scannedVehicles.length}</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">{session.rooftop?.city} - {session.rooftop?.name}</p>

      <Card className="flex-1 flex flex-col items-center justify-center gap-6 border-dashed border-2 border-gray-300 mb-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
          </div>
          <div className="px-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">Point scanner at VIN</h2>
            <p className="text-gray-500">barcode and press the physical scan button on your device</p>
          </div>
        </div>

        <div className="w-full flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="w-full space-y-4">
          <Input 
            label="Enter VIN manually" 
            placeholder="1HGBH41JXMN109186" 
            value={manualVin} 
            onChange={(val) => setManualVin(val.toUpperCase())}
            error={error || undefined}
          />
          <Button onClick={handleSubmit} disabled={!manualVin}>
            Submit VIN
          </Button>
        </div>
      </Card>

      {lastScanned && (
        <div className="p-4 bg-white rounded-lg border-l-4 border-l-[#0066CC] mb-4">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Last scanned</p>
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-sm tracking-tighter">{lastScanned.vin}</span>
            <span className="text-sm font-bold">{getStatusIcon(lastScanned.status)}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showEndConfirm && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">End Audit Session?</h3>
            <p className="text-gray-600 mb-6">
              You scanned <span className="font-bold text-black">{session.scannedVehicles.length}</span> vehicles. 
              Are you sure you want to end this audit session?
            </p>
            <div className="space-y-3">
              <Button variant="danger" onClick={onEndAudit}>End Audit</Button>
              <Button variant="outline" onClick={() => setShowEndConfirm(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScanningScreen;
