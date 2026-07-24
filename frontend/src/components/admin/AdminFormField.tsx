import React from 'react';

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'datetime-local' | 'password' | 'url';
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  hint?: string;
  disabled?: boolean;
  className?: string;
}

const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  rows = 3,
  options = [],
  hint,
  disabled = false,
  className = '',
}) => {
  const inputClasses = 'w-full px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary transition bg-white';

  if (type === 'checkbox') {
    return (
      <div className={`flex items-center ${className}`}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-5 h-5 rounded border-surface-300 text-primary focus:ring-primary mr-3"
        />
        <label className="text-sm font-bold text-text cursor-pointer">{label}</label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-bold text-text mb-1">
        {label}{required && ' *'}
      </label>

      {type === 'textarea' ? (
        <textarea
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClasses} resize-none`}
        />
      ) : type === 'select' ? (
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}

      {hint && <p className="text-xs text-text-secondary mt-1">{hint}</p>}
    </div>
  );
};

export default AdminFormField;
