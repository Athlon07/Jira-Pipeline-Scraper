
import React from 'react';
import { Project } from '../types';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjects: string[];
  onToggleProject: (projectKey: string) => void;
  isDisabled: boolean;
}

const ProjectCard: React.FC<{
  project: Project;
  isSelected: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}> = ({ project, isSelected, onToggle, isDisabled }) => {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`
        p-4 border rounded-lg text-left w-full transition-all duration-200
        ${isSelected
          ? 'bg-brand-blue-light border-brand-blue ring-2 ring-brand-blue'
          : 'bg-white border-brand-gray-200 hover:border-brand-blue hover:shadow-md'
        }
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-brand-gray-900">{project.name}</h3>
          <p className="text-sm text-brand-gray-700 mt-1">{project.description}</p>
        </div>
        <div className={`
          flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center
          ${isSelected ? 'bg-brand-blue border-brand-blue' : 'border-brand-gray-300'}
        `}>
          {isSelected && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>
    </button>
  );
};


const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProjects, onToggleProject, isDisabled }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-200">
      <h2 className="text-lg font-bold text-brand-gray-900 mb-1">1. Select Projects</h2>
      <p className="text-sm text-brand-gray-600 mb-4">Choose from the available Apache Jira projects to begin.</p>
      <div className="space-y-3">
        {projects.map(project => (
          <ProjectCard
            key={project.key}
            project={project}
            isSelected={selectedProjects.includes(project.key)}
            onToggle={() => onToggleProject(project.key)}
            isDisabled={isDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;
