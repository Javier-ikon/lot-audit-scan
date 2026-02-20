
import React, { useState } from 'react';
import { Button } from '../components/UIElements';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = () => {
    setIsLoading(true);
    // Simulate SSO redirect and authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 bg-white">
      {/* Top Branding */}
      <div className="mt-20 flex flex-col items-center">
        <div className="w-24 h-24 bg-[#0066CC] rounded-2xl flex items-center justify-center mb-6 text-white font-bold text-4xl shadow-lg transform -rotate-3">
          IKON
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lot Audit Tool</h1>
        <p className="text-gray-500 mt-2 font-medium">Field Support Manager Portal</p>
      </div>

      {/* SSO Login Action */}
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-widest">Enterprise Login</h2>
          <div className="h-1 w-12 bg-[#0066CC] mx-auto mt-2 rounded-full"></div>
        </div>

        <Button 
          onClick={handleSSOLogin} 
          disabled={isLoading}
          className="relative overflow-hidden group"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <span>Log in with Ikon ID</span>
            </div>
          )}
        </Button>

        <div className="text-center space-y-4">
          <p className="text-xs text-gray-400 font-medium">
            Authorized Personnel Only. Access is secured via Microsoft Azure AD.
          </p>
          <div className="flex justify-center gap-4">
            <button className="text-[#0066CC] text-xs font-bold uppercase hover:underline">Trouble Signing In?</button>
            <span className="text-gray-300">|</span>
            <button className="text-[#0066CC] text-xs font-bold uppercase hover:underline">Support</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mb-4 text-center">
        <p className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">Property of PlanetX Technologies</p>
        <p className="text-gray-400 text-[10px] mt-1">Version 1.2.4 (Build 2026.02.13)</p>
      </div>
    </div>
  );
};

export default LoginScreen;
