import React from 'react';
import { Users, FileText, Bell, GraduationCap } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { title: 'Total Departments', value: '24', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Faculty Members', value: '150+', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Active Notices', value: '12', icon: Bell, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { title: 'Published Pages', value: '8', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard Overview</h1>
          <p className="text-text-secondary">Welcome back to the GPPVVS Admin Portal</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition shadow-sm">
          + Quick Add Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Recent Activity</h2>
          <div className="text-center py-10 text-text-secondary text-sm">
            Activity logs will be implemented in the next phase.
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
          <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">System Status</h2>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected (Neon)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">API Server</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Storage Space</span>
              <span className="text-sm font-medium text-text">45% used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
