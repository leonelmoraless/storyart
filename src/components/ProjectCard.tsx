import React, { useState, useRef, useEffect } from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onUpdateProject: (project: Project) => void;
}

const FloppyDiskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>

);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);


const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEditClick, onDeleteClick, onUpdateProject }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(project.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isEditingName) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditingName]);

    const handleSaveName = () => {
        if (name.trim() && name.trim() !== project.name) {
            onUpdateProject({ ...project, name: name.trim() });
        } else {
            setName(project.name);
        }
        setIsEditingName(false);
    };


    return (
        <div className="bg-slate-800 rounded-lg shadow-md group relative text-white flex flex-col p-4 aspect-[4/5] justify-between border border-slate-700 hover:border-violet-500 transition-all">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={(e) => { e.stopPropagation(); onDeleteClick(); }} className="p-2 bg-black/50 rounded-full hover:bg-black/75 text-red-500 backdrop-blur-sm">
                    <TrashIcon />
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 cursor-pointer" onClick={onEditClick}>
                <FloppyDiskIcon />
            </div>
            <div className="text-center">
                 {isEditingName ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onClick={e => e.stopPropagation()}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="w-full text-center text-lg font-bold bg-slate-700 rounded-md p-1 outline-none ring-2 ring-violet-500"
                    />
                ) : (
                    <h3 
                        className="text-lg font-bold truncate p-1 cursor-pointer" 
                        onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                        title="Click para editar el nombre"
                    >
                        {project.name}
                    </h3>
                )}
                <button onClick={onEditClick} className="w-full mt-3 py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    Editar
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;