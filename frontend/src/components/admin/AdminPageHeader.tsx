import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  children,
}) => {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
      <div>
        <h1 className="text-2xl font-bold text-primary font-heading">{title}</h1>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
          >
            {ActionIcon && <ActionIcon size={18} className="mr-2" />}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
