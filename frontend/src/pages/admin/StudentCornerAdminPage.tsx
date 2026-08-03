import React, { useState, useEffect } from 'react';
import { Users, FileDown, BookOpen } from 'lucide-react';
import DownloadsAdminPage from './DownloadsAdminPage';
import CommitteesAdminPage from './CommitteesAdminPage';
import ExaminationsAdminPage from './ExaminationsAdminPage';

const StudentCornerAdminPage = () => {
  const [activeTab, setActiveTab] = useState('downloads');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <Users className="mr-3 text-primary" size={28} /> Manage Student Corner
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="flex border-b border-surface-200">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'downloads' ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:bg-surface-50'
            }`}
          >
            <FileDown size={18} className="mr-2" /> Downloads
          </button>
          <button
            onClick={() => setActiveTab('committees')}
            className={`flex items-center px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'committees' ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:bg-surface-50'
            }`}
          >
            <Users size={18} className="mr-2" /> Committees & Cells
          </button>
          <button
            onClick={() => setActiveTab('examinations')}
            className={`flex items-center px-6 py-4 font-bold text-sm transition-colors ${
              activeTab === 'examinations' ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:bg-surface-50'
            }`}
          >
            <BookOpen size={18} className="mr-2" /> Examinations
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'downloads' && (
            <div className="embedded-admin-page">
              <DownloadsAdminPage />
            </div>
          )}
          {activeTab === 'committees' && (
            <div className="embedded-admin-page">
              <CommitteesAdminPage />
            </div>
          )}
          {activeTab === 'examinations' && (
            <div className="embedded-admin-page">
              <ExaminationsAdminPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCornerAdminPage;
