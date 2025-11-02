export interface Project {
  key: string;
  name: string;
  description: string;
}

export interface JiraComment {
  author: string;
  created: string;
  body: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  project: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  reporter: string;
  assignee: string | null;
  created: string;
  updated: string;
  labels: string[];
  comments: JiraComment[];
}

export interface ScrapingProgress {
  currentProject: string;
  statusMessage: string;
  projectsScanned: number;
  issuesScraped: number;
  commentsProcessed: number;
  totalProjects: number;
}

export interface TransformedData {
  issue_metadata: {
    id: string;
    key: string;
    project: string;
    title: string;
    status: string;
    priority: string;
    reporter: string;
    assignee: string | null;
    created: string;
    updated: string;
    labels: string[];
  };
  full_text: string;
  derived_tasks: {
    summarization_input: string;
    summarization_output?: string;
    classification_input: string;
    classification_output?: string;
    qna_context: string;
    qna_pairs?: { question: string; answer: string }[];
  };
}