import React from 'react';
import type { Project } from '../types';
import ProjectCard from '../components/ProjectCard';

interface ProjectsProps {
    projects: Project[];
    onSetActiveProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    onUpdateProject: (project: Project) => void;
    onAddProject: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onSetActiveProject, onDeleteProject, onUpdateProject, onAddProject }) => {

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-white p-6">
                <div className="mb-6 text-slate-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">No hay proyectos aún</h2>
                <p className="text-lg text-slate-400 mb-8">Crea tu primera historia</p>
                <button onClick={onAddProject} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Crear nuevo Proyecto</span>
                </button>
            </div>
        );
    }
    
    return (
        <div className="text-white p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                 <h2 className="text-3xl font-bold text-white">Proyectos</h2>
                <p className="text-slate-400 mt-1">Gestiona tus historias y proyectos</p>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {projects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} onEditClick={() => onSetActiveProject(proj)} onDeleteClick={() => onDeleteProject(proj.id)} onUpdateProject={onUpdateProject} />
                ))}
            </div>
        </div>
    );
};

export default Projects;