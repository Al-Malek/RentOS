import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#1A1A24] border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg p-2.5 text-sm text-white focus:border-[#00E5FF] focus:outline-none transition ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
