
import React from 'react';
import { ScrapingProgress } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ProgressMonitorProps {
  progress: ScrapingProgress;
  error: string | null;
}

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="bg-brand-gray-100 p-3 rounded-md text-center">
    <div className="text-xl font-bold text-brand-gray-900">{value}</div>
    <div className="text-xs text-brand-gray-600 uppercase tracking-wider">{label}</div>
  </div>
);

const ProgressMonitor: React.FC<ProgressMonitorProps> = ({ progress, error }) => {
  const { currentProject, statusMessage, projectsScanned, issuesScraped, commentsProcessed, totalProjects } = progress;
  const isComplete = !error && projectsScanned === totalProjects && totalProjects > 0;
  const isRunning = !isComplete && !error && projectsScanned < totalProjects && totalProjects > 0;
  
  const getIcon = () => {
    if (error) return <ErrorIcon className="h-5 w-5 text-red-500" />;
    if (isComplete) return <CheckIcon className="h-5 w-5 text-green-500" />;
    if (isRunning) return <SpinnerIcon className="h-5 w-5 text-brand-blue animate-spin" />;
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-200">
      <h2 className="text-lg font-bold text-brand-gray-900 mb-4">3. Monitor Progress</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-brand-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-brand-gray-800">{projectsScanned} / {totalProjects} Projects</span>
        </div>
        <div className="w-full bg-brand-gray-200 rounded-full h-2.5">
          <div 
            className="bg-brand-blue h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${totalProjects > 0 ? (projectsScanned / totalProjects) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-brand-gray-50 rounded-md mb-4 text-sm">
        {getIcon()}
        <span className={`font-medium ${error ? 'text-red-700' : 'text-brand-gray-800'}`}>
          {error ? error : statusMessage}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Projects" value={projectsScanned} />
        <StatCard label="Issues" value={issuesScraped} />
        <StatCard label="Comments" value={commentsProcessed} />
      </div>
    </div>
  );
};

export default ProgressMonitor;
