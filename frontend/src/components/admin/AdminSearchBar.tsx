import React from 'react';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`p-4 border-b border-surface-200 bg-surface-50 ${className}`}>
      <div className="relative w-64">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary text-sm"
        />
        <Search className="absolute left-3 top-2.5 text-text-secondary" size={16} />
      </div>
    </div>
  );
};

export default AdminSearchBar;
