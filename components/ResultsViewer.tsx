
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResultsViewerProps {
  results: string;
  isAnalyzing: boolean;
  analysisResult: string;
  onAnalyze: () => void;
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({ results, isAnalyzing, analysisResult, onAnalyze }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(results).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-200 h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h2 className="text-lg font-bold text-brand-gray-900">4. Corpus & Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!results}
            className="px-4 py-2 text-sm font-semibold bg-brand-gray-100 text-brand-gray-800 rounded-md hover:bg-brand-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Corpus'}
          </button>
          <button
            onClick={onAnalyze}
            disabled={!results || isAnalyzing}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isAnalyzing && <SpinnerIcon className="h-4 w-4 animate-spin" />}
            Analyze with Gemini
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-brand-gray-800 mb-2">Generated JSONL Corpus</h3>
          <pre className="bg-brand-gray-950 text-white p-4 rounded-md text-xs h-96 overflow-auto font-mono">
            {results || <span className="text-brand-gray-500">Scraping results will appear here...</span>}
          </pre>
        </div>
        <div>
          <h3 className="font-semibold text-brand-gray-800 mb-2">Gemini Analysis</h3>
          <div className="bg-brand-gray-50 border border-brand-gray-200 p-4 rounded-md h-96 overflow-auto prose prose-sm max-w-none">
            {isAnalyzing && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <SpinnerIcon className="h-8 w-8 text-brand-blue animate-spin mx-auto" />
                  <p className="mt-2 text-brand-gray-600">Gemini is analyzing the data...</p>
                </div>
              </div>
            )}
            {analysisResult ? <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} /> : !isAnalyzing && <p className="text-brand-gray-500">AI-powered analysis and derived tasks will appear here...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsViewer;
