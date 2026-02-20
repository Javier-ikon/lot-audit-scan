
import React, { useState } from 'react';
import { AuditSession, VehicleStatus } from '../types';
import { Button, Card } from '../components/UIElements';

interface ReportScreenProps {
  session: AuditSession;
  onDownload: () => void;
  onStartNew: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ session, onDownload, onStartNew }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const stats = {
    total: session.scannedVehicles.length,
    ok: session.scannedVehicles.filter(v => v.status === VehicleStatus.OK).length,
    attention: session.scannedVehicles.filter(v => v.status === VehicleStatus.NEEDS_ATTENTION).length,
    notFound: session.scannedVehicles.filter(v => v.status === VehicleStatus.NOT_FOUND).length,
  };

  const calculatePct = (val: number) => {
    if (stats.total === 0) return '0%';
    return `${Math.round((val / stats.total) * 100)}%`;
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate generation and download
    setTimeout(() => {
      setIsDownloading(false);
      onDownload();
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-[#00AA00]">Audit Complete! ✅</h1>
      </div>

      <Card className="bg-gray-50 mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
          <span className="text-3xl">📊</span>
          <h2 className="text-xl font-bold">Audit Summary</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Rooftop</p>
              <p className="font-bold text-gray-800">{session.rooftop?.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Auditor</p>
              <p className="font-bold text-gray-800">{session.auditor.name}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date</p>
            <p className="font-bold text-gray-800">{session.startDate?.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-bold">Total Scanned</span>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-l-green-600 shadow-sm">
            <span className="font-medium text-green-700">✅ OK</span>
            <span className="font-bold">{stats.ok} ({calculatePct(stats.ok)})</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-l-orange-500 shadow-sm">
            <span className="font-medium text-orange-700">⚠️ Needs Attention</span>
            <span className="font-bold">{stats.attention} ({calculatePct(stats.attention)})</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded border-l-4 border-l-red-600 shadow-sm">
            <span className="font-medium text-red-700">❌ Not Found</span>
            <span className="font-bold">{stats.notFound} ({calculatePct(stats.notFound)})</span>
          </div>
        </div>
      </Card>

      <div className="mt-auto pb-4 space-y-4">
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Generating CSV...' : 'Download CSV Report'}
        </Button>
        <Button variant="outline" onClick={onStartNew} disabled={isDownloading}>
          Start New Audit
        </Button>
      </div>
    </div>
  );
};

export default ReportScreen;
