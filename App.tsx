import React, { useState, useCallback, useRef } from 'react';
import { ScrapingProgress } from './types';
import { APACHE_PROJECTS } from './constants';
import { runScrapingSimulation } from './services/jiraScraper';
import { analyzeDataWithGemini } from './services/geminiService';
import ProjectSelector from './components/ProjectSelector';
import ControlPanel from './components/ControlPanel';
import ProgressMonitor from './components/ProgressMonitor';
import ResultsViewer from './components/ResultsViewer';
import { JiraIcon } from './components/icons/JiraIcon';

const INITIAL_PROGRESS: ScrapingProgress = {
  currentProject: '',
  statusMessage: 'Ready to start.',
  projectsScanned: 0,
  issuesScraped: 0,
  commentsProcessed: 0,
  totalProjects: 0,
};

export default function App() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [progress, setProgress] = useState<ScrapingProgress>(INITIAL_PROGRESS);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const stopScrapingRef = useRef<(() => void) | null>(null);

  const handleToggleProject = useCallback((projectKey: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectKey)
        ? prev.filter(p => p !== projectKey)
        : [...prev, projectKey]
    );
  }, []);

  const handleStartScraping = useCallback(async () => {
    if (selectedProjects.length === 0) {
      setError('Please select at least one project to scrape.');
      return;
    }
    setError(null);
    setResults('');
    setAnalysisResult('');
    setIsScraping(true);
    setProgress({
        ...INITIAL_PROGRESS,
        statusMessage: 'Initializing simulation...',
        totalProjects: selectedProjects.length,
    });
    
    const { stop } = runScrapingSimulation(
      selectedProjects,
      (newProgress) => {
        setProgress(newProgress);
      },
      (finalResults) => {
        setResults(finalResults);
        setIsScraping(false);
        stopScrapingRef.current = null;
      },
      (errorMessage) => {
        setError(`Scraping Error: ${errorMessage}`);
        setIsScraping(false);
        stopScrapingRef.current = null;
      }
    );
    stopScrapingRef.current = stop;
  }, [selectedProjects]);

  const handleStopScraping = useCallback(() => {
    if (stopScrapingRef.current) {
      stopScrapingRef.current();
      setIsScraping(false);
      stopScrapingRef.current = null;
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!results) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    setError(null);
    try {
      const analysis = await analyzeDataWithGemini(results);
      setAnalysisResult(analysis);
    } catch (e) {
      setError(`Gemini API Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-brand-gray-50 font-sans">
      <header className="bg-white border-b border-brand-gray-200 p-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-4">
          <JiraIcon className="h-8 w-8 text-brand-blue" />
          <div>
            <h1 className="text-xl font-bold text-brand-gray-900">Jira Scraper & LLM Corpus Creator</h1>
            <p className="text-sm text-brand-gray-700">Scrape live Jira data and prepare it for LLM training.</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ProjectSelector
              projects={APACHE_PROJECTS}
              selectedProjects={selectedProjects}
              onToggleProject={handleToggleProject}
              isDisabled={isScraping}
            />
            <ControlPanel
              isScraping={isScraping}
              onStart={handleStartScraping}
              onStop={handleStopScraping}
              canStart={selectedProjects.length > 0}
            />
            <ProgressMonitor progress={progress} error={error} />
          </div>
          <div className="lg:col-span-2">
            <ResultsViewer
              results={results}
              isAnalyzing={isAnalyzing}
              analysisResult={analysisResult}
              onAnalyze={handleAnalyze}
            />
          </div>
        </div>
      </main>
    </div>
  );
}