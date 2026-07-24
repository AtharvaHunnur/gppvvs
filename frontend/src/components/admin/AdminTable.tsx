import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  rowKey?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  emptyMessage = 'No items found.',
  rowKey = 'id',
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-4 font-bold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {data.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-surface-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`p-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-text-secondary">
                <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
