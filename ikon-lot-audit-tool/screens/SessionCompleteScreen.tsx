
import React from 'react';
import { Button, Card } from '../components/UIElements';

interface SessionCompleteScreenProps {
  onDone: () => void;
  onStartNew: () => void;
}

const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({ onDone, onStartNew }) => {
  const fileName = `audit_${Math.floor(Math.random() * 100000)}_${new Date().toISOString().split('T')[0]}.csv`;

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
        <div className="text-8xl animate-bounce">✅</div>
        <h1 className="text-4xl font-bold text-[#00AA00]">Success!</h1>
        <p className="text-gray-600 text-lg">Report downloaded successfully.</p>
      </div>

      <Card className="bg-white border-2 border-dashed border-gray-200 mb-8 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📁</span>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">File Saved</p>
            <p className="font-mono text-xs break-all text-gray-800">{fileName}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6 flex-1">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📧</span>
            <h3 className="font-bold text-blue-900 text-lg">Next Steps:</h3>
          </div>
          <ol className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              <span>Open your email application</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              <span>Attach the CSV file from Downloads</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              <span>Send to your Regional Manager</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-auto space-y-3 py-4">
        <Button onClick={() => alert('Launching email app...')}>Open Email App</Button>
        <Button variant="outline" onClick={onStartNew}>Start New Audit</Button>
        <Button variant="secondary" onClick={onDone}>Done</Button>
      </div>
    </div>
  );
};

export default SessionCompleteScreen;
