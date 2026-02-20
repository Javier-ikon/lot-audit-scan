
import React, { useState } from 'react';
import { Rooftop } from '../types';
import { ROOFTOPS } from '../constants';
import { Button } from '../components/UIElements';

interface RooftopSelectionScreenProps {
  onSelect: (rooftop: Rooftop) => void;
  onBack: () => void;
}

const RooftopSelectionScreen: React.FC<RooftopSelectionScreenProps> = ({ onSelect, onBack }) => {
  const [selectedRooftop, setSelectedRooftop] = useState<Rooftop | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[#0066CC] font-bold flex items-center gap-1 p-2">
          ← Back
        </button>
        <button onClick={onBack} className="text-gray-500 font-bold p-2">
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Rooftop</h1>

      <div className="relative mb-8">
        <label className="text-sm font-medium text-gray-500 mb-1 block">Select a rooftop...</label>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full h-14 bg-white border border-gray-300 rounded-md px-4 flex justify-between items-center text-left text-lg focus:ring-2 focus:ring-[#0066CC]"
        >
          <span className={selectedRooftop ? 'text-black' : 'text-gray-400'}>
            {selectedRooftop ? `${selectedRooftop.city} - ${selectedRooftop.name}` : 'Select a rooftop...'}
          </span>
          <span className="text-gray-500">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md mt-1 shadow-xl max-h-80 overflow-y-auto">
            {ROOFTOPS.map((rooftop) => (
              <button
                key={rooftop.id}
                onClick={() => {
                  setSelectedRooftop(rooftop);
                  setIsDropdownOpen(false);
                }}
                className="w-full h-14 px-4 flex items-center gap-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRooftop?.id === rooftop.id ? 'border-[#0066CC]' : 'border-gray-300'}`}>
                  {selectedRooftop?.id === rooftop.id && <div className="w-2.5 h-2.5 bg-[#0066CC] rounded-full" />}
                </div>
                <span className="text-lg">{rooftop.city} - {rooftop.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pb-4">
        <Button 
          disabled={!selectedRooftop} 
          onClick={() => selectedRooftop && onSelect(selectedRooftop)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RooftopSelectionScreen;
