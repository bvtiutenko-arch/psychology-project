import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  enumObject: { [key: string]: string };
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, enumObject, disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-slate-700 text-sm font-bold mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="shadow border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
        disabled={disabled}
      >
        <option value="" disabled>Selecciona una opción</option>
        {Object.values(enumObject).map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
