import React from 'react';

interface Props {
  label?: string;
  value: string | string[];
  options: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
  multiple?: boolean;
}

export function Select({ label, value, options, onChange, error, required, multiple }: Props) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#2C2C2C] dark:text-white mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        multiple={multiple}
        value={multiple ? (Array.isArray(value) ? value : []) : value}
        onChange={(e) => {
          if (multiple) {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            onChange(selected);
          } else {
            onChange([e.target.value]);
          }
        }}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                 dark:bg-[#2C2C2C] dark:text-white focus:ring-2 focus:ring-[#FFB7C5] 
                 focus:border-transparent"
        required={required}
      >
        {!multiple && value === '' && <option value="" disabled>Select an option</option>}
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}