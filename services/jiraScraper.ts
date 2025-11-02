import { JiraIssue, ScrapingProgress, TransformedData } from '../types';
import { SAMPLE_API_DATA } from './sample-data';

const ISSUES_PER_PROJECT = 20; // Limit to keep the process fast

// --- Data Transformation ---

const transformApiIssueToJiraIssue = (apiIssue: any, comments: any[]): JiraIssue => {
  return {
    id: apiIssue.id,
    key: apiIssue.key,
    project: apiIssue.fields.project.key,
    title: apiIssue.fields.summary,
    description: apiIssue.fields.description || 'No description provided.',
    status: apiIssue.fields.status.name,
    priority: apiIssue.fields.priority?.name || 'N/A',
    reporter: apiIssue.fields.reporter?.displayName || 'Unknown',
    assignee: apiIssue.fields.assignee?.displayName || null,
    created: apiIssue.fields.created,
    updated: apiIssue.fields.updated,
    labels: apiIssue.fields.labels || [],
    comments: comments.map(comment => ({
      author: comment.author?.displayName || 'Unknown',
      created: comment.created,
      body: comment.body,
    })),
  };
};

const transformToJSONL = (issue: JiraIssue): string => {
  const fullText = [
    `Title: ${issue.title}`,
    `Description: ${issue.description || 'N/A'}`,
    ...issue.comments.map(c => `Comment by ${c.author}: ${c.body}`)
  ].join('\n\n');

  const transformed: TransformedData = {
    issue_metadata: {
      id: issue.id,
      key: issue.key,
      project: issue.project,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      reporter: issue.reporter,
      assignee: issue.assignee,
      created: issue.created,
      updated: issue.updated,
      labels: issue.labels,
    },
    full_text: fullText,
    derived_tasks: {
      summarization_input: fullText,
      classification_input: fullText,
      qna_context: fullText,
    },
  };
  return JSON.stringify(transformed);
};

// --- Scraping Logic ---

let isScrapingStopped = false;
let timeoutIds: number[] = [];

const delay = (ms: number) => new Promise(resolve => {
    const id = window.setTimeout(resolve, ms);
    timeoutIds.push(id);
});


export const runScrapingSimulation = (
  projects: string[],
  onProgress: (progress: ScrapingProgress) => void,
  onComplete: (results: string) => void,
  onError: (errorMessage: string) => void
): { stop: () => void } => {
  isScrapingStopped = false;
  timeoutIds = [];
  
  let issuesScrapedTotal = 0;
  let commentsProcessedTotal = 0;
  let allResults: string[] = [];

  const scrape = async () => {
    try {
      for (let i = 0; i < projects.length; i++) {
        if (isScrapingStopped) break;
        const projectKey = projects[i];
        
        onProgress({
          currentProject: projectKey,
          statusMessage: `Fetching issues for project: ${projectKey}...`,
          projectsScanned: i,
          issuesScraped: issuesScrapedTotal,
          commentsProcessed: commentsProcessedTotal,
          totalProjects: projects.length,
        });

        await delay(500); // Simulate network delay for fetching issues
        if (isScrapingStopped) break;

        const projectData = SAMPLE_API_DATA[projectKey as keyof typeof SAMPLE_API_DATA];
        if (!projectData) {
            console.warn(`No sample data for project ${projectKey}. Skipping.`);
            continue;
        }

        const issues = projectData.issues.slice(0, ISSUES_PER_PROJECT);

        for (const apiIssue of issues) {
            if (isScrapingStopped) break;
          
            onProgress({
                currentProject: projectKey,
                statusMessage: `Processing issue ${apiIssue.key}`,
                projectsScanned: i,
                issuesScraped: issuesScrapedTotal,
                commentsProcessed: commentsProcessedTotal,
                totalProjects: projects.length,
            });
            
            await delay(50); // Simulate network delay for fetching comments
            if (isScrapingStopped) break;

            const comments = projectData.comments[apiIssue.key as keyof typeof projectData.comments] || [];

            const issue = transformApiIssueToJiraIssue(apiIssue, comments);
            allResults.push(transformToJSONL(issue));

            issuesScrapedTotal++;
            commentsProcessedTotal += issue.comments.length;
        }
        
        if (isScrapingStopped) break;
        
        onProgress({
          currentProject: projectKey,
          statusMessage: `Finished scraping ${projectKey}.`,
          projectsScanned: i + 1,
          issuesScraped: issuesScrapedTotal,
          commentsProcessed: commentsProcessedTotal,
          totalProjects: projects.length,
        });
      }
      
      if (isScrapingStopped) {
         onProgress({
            currentProject: '',
            statusMessage: 'Scraping stopped by user.',
            projectsScanned: projects.length, // Show as complete
            issuesScraped: issuesScrapedTotal,
            commentsProcessed: commentsProcessedTotal,
            totalProjects: projects.length,
        });
      } else {
        onProgress({
            currentProject: '',
            statusMessage: 'Scraping complete.',
            projectsScanned: projects.length,
            issuesScraped: issuesScrapedTotal,
            commentsProcessed: commentsProcessedTotal,
            totalProjects: projects.length,
        });
      }
      onComplete(allResults.join('\n'));

    } catch (error: any) {
       console.error('An error occurred during scraping simulation:', error);
       onError(error.message || 'An unknown error occurred.');
    } finally {
        timeoutIds.forEach(clearTimeout);
        timeoutIds = [];
    }
  };

  scrape();

  const stop = () => {
    isScrapingStopped = true;
  };

  return { stop };
};