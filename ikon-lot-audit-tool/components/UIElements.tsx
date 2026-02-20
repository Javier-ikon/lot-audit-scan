
import React from 'react';
import { COLORS } from '../constants';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  fullWidth = true
}) => {
  const baseStyles = "h-14 rounded-lg font-bold text-lg uppercase transition-all active:scale-95 flex items-center justify-center px-4 shadow-sm";
  const variants = {
    primary: `bg-[#0066CC] text-white ${disabled ? 'bg-gray-300' : 'hover:bg-[#0052A3]'}`,
    secondary: `bg-gray-500 text-white ${disabled ? 'bg-gray-300' : 'hover:bg-gray-600'}`,
    danger: `bg-[#CC0000] text-white ${disabled ? 'bg-gray-300' : 'hover:bg-[#A30000]'}`,
    success: `bg-[#00AA00] text-white ${disabled ? 'bg-gray-300' : 'hover:bg-[#008800]'}`,
    outline: `bg-white border-2 border-[#0066CC] text-[#0066CC] ${disabled ? 'border-gray-300 text-gray-300' : 'hover:bg-blue-50'}`
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, placeholder, value, onChange, type = 'text', error }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-14 px-4 border rounded-md text-lg focus:ring-2 focus:ring-[#0066CC] transition-all ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-xs text-[#CC0000] mt-1 font-bold">{error}</p>}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; border?: string }> = ({ children, className = '', border }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} style={{ border: border ? `2px solid ${border}` : 'none' }}>
      {children}
    </div>
  );
};
