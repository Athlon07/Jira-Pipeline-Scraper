import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ControlPanelProps {
  isScraping: boolean;
  onStart: () => void;
  onStop: () => void;
  canStart: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isScraping, onStart, onStop, canStart }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-200">
      <h2 className="text-lg font-bold text-brand-gray-900 mb-4">2. Control Process</h2>
      {isScraping ? (
        <button
          onClick={onStop}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <SpinnerIcon className="h-5 w-5 animate-spin"/>
          Stop Scraping
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full bg-brand-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 disabled:bg-brand-gray-300 disabled:cursor-not-allowed"
        >
          Start Scraping
        </button>
      )}
    </div>
  );
};

export default ControlPanel;