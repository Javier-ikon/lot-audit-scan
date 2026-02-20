
import React from 'react';
import { AuditSession } from '../types';
import { Button, Card } from '../components/UIElements';

interface StartAuditScreenProps {
  session: AuditSession;
  onStart: () => void;
  onBack: () => void;
}

const StartAuditScreen: React.FC<StartAuditScreenProps> = ({ session, onStart, onBack }) => {
  const currentDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-[#0066CC] font-bold flex items-center gap-1 p-2">
          ← Back
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ready to Start Audit</h1>

      <Card className="mb-8 bg-gray-50 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-xl">📍</span>
            <span className="font-medium uppercase tracking-wider text-xs">Rooftop</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{session.rooftop?.city} - {session.rooftop?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-xl">👤</span>
            <span className="font-medium uppercase tracking-wider text-xs">Auditor</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{session.auditor.name}</p>
          <p className="text-gray-600">{session.auditor.email}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <span className="text-xl">📅</span>
            <span className="font-medium uppercase tracking-wider text-xs">Date</span>
          </div>
          <p className="text-lg text-gray-900">{currentDate}</p>
        </div>
      </Card>

      <div className="mt-auto pb-4">
        <Button variant="success" onClick={onStart}>
          Start Audit
        </Button>
      </div>
    </div>
  );
};

export default StartAuditScreen;
