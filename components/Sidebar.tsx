import React, { useState, useRef, useEffect } from 'react';
import type { View } from '../App';
import type { Project, Character, Scene } from '../types';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    projects: Project[];
    characters: Character[];
    activeProject: Project | null;
    activeScene: Scene | null;
    onAddProject: () => void;
    onGenerateCharacter: () => void;
    onGenerateScene: () => void;
    onAddScene: () => void;
    onSetActiveProject: (project: Project) => void;
    onSetActiveScene: (scene: Scene) => void;
    onUpdateProject: (project: Project) => void;
    onUpdateScene: (scene: Scene) => void;
    onDeleteScene: (sceneId: string) => void;
}

const EditableName: React.FC<{ initialName: string, onSave: (newName: string) => void }> = ({ initialName, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        } else {
            setName(initialName); // Reset if empty
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-slate-600 text-white px-1 py-0 rounded"
            />
        );
    }

    return (
        <>
            <span className="truncate flex-1" title={name}>{name}</span>
            <button onClick={() => setIsEditing(true)} className="text-xs text-gray-500 cursor-pointer hover:text-white flex-shrink-0 ml-2">Editar</button>
        </>
    );
};


const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3 5.197z" />
    </svg>
);

const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const CrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.1-1.401M15 19.128a9.38 9.38 0 01-2.625.372 9.337 9.337 0 01-4.1-1.401M15 19.128V12.75a3 3 0 00-6 0v6.378m6-6.378a3 3 0 00-6 0m6 0a3 3 0 00-6 0M3 21h18M12 3.75l-4.5 4.5h9L12 3.75z" />
    </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = (props) => {
    const {
        currentView, setView, projects, characters, activeProject, activeScene,
        onAddProject, onGenerateCharacter, onGenerateScene, onAddScene,
        onSetActiveProject, onSetActiveScene, onUpdateProject, onUpdateScene, onDeleteScene
    } = props;

    const renderContextualMenu = () => {
        switch (currentView) {
            case 'home':
                if (!activeProject) return null;
                return (
                    <div className="border-t border-slate-700 pt-4 space-y-2 flex flex-col flex-1">
                        <div className="px-4">
                            <EditableName 
                                initialName={activeProject.name}
                                onSave={(newName) => onUpdateProject({...activeProject, name: newName})}
                            />
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-2">
                            {activeProject.scenes.map(scene => (
                                 <div key={scene.id} onClick={() => onSetActiveScene(scene)} className={`w-full text-left text-sm text-gray-300 px-4 py-2 rounded-md flex justify-between items-center transition-colors cursor-pointer group ${activeScene?.id === scene.id ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                                    <EditableName initialName={scene.name} onSave={(newName) => onUpdateScene({...scene, name: newName})} />
                                    <button onClick={(e) => {e.stopPropagation(); onDeleteScene(scene.id)}} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                 </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-700 mt-2 pt-2">
                            <h3 className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Personajes</h3>
                            <div className="min-h-0 overflow-y-auto space-y-1 pr-2 max-h-48">
                                {characters.map(char => (
                                    <div 
                                        key={char.id}
                                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700 cursor-grab"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('application/json', JSON.stringify(char));
                                        }}
                                        title={`Arrastrar ${char.name} al lienzo`}
                                    >
                                        <img src={char.imageUrl} alt={char.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-500" />
                                        <span className="text-sm text-gray-300 truncate">{char.name}</span>
                                    </div>
                                ))}
                                {characters.length === 0 && <p className="px-4 text-xs text-gray-500">Cree personajes en la pestaña 'Personajes'.</p>}
                            </div>
                        </div>
                         <div className="mt-auto pt-2 space-y-2">
                            <button onClick={onAddScene} className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                <span>Añadir Nueva Escena</span>
                            </button>
                            <button onClick={onGenerateScene} className="w-full py-2 px-4 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 transition-colors">
                                Generar Escena (IA)
                            </button>
                        </div>
                    </div>
                );
            case 'characters':
                 return (
                     <div className="border-t border-slate-700 pt-4 space-y-2 flex flex-col flex-1">
                        <h2 className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Personajes guardados</h2>
                        <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-2">
                            {characters.map(char => (
                                <div key={char.id} className="w-full text-left text-sm text-gray-300 px-4 py-2 rounded-md hover:bg-slate-700 flex justify-between items-center">
                                    <span className="truncate">{char.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-2">
                             <button onClick={onGenerateCharacter} className="w-full py-2 px-4 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 transition-colors">
                                Generar Personaje (IA)
                            </button>
                        </div>
                    </div>
                );
            case 'projects':
                 return (
                     <div className="border-t border-slate-700 pt-4 space-y-2 flex flex-col flex-1">
                        <h2 className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Proyectos guardados</h2>
                         <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-2">
                            {projects.map(proj => (
                                <div key={proj.id} className="w-full text-left text-sm text-gray-300 px-4 py-2 rounded-md hover:bg-slate-700 flex justify-between items-center">
                                    <span className="truncate cursor-pointer flex-1" onClick={() => onSetActiveProject(proj)}>{proj.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-2">
                            <button onClick={onAddProject} className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 transition-colors">
                                <span>Crear nuevo Proyecto</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <aside className="w-72 bg-[#0B1120] p-4 flex flex-col space-y-4 flex-shrink-0">
            <div className="flex items-center space-x-3 px-2 pb-4 border-b border-slate-700">
                <MenuIcon className="h-8 w-8 text-white"/>
                <div>
                  <h1 className="text-xl font-bold text-white">StoryArt</h1>
                  <p className="text-xs text-gray-400">Creador de Novelas Visuales</p>
                </div>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li><NavItem icon={<HomeIcon />} label="Inicio" isActive={currentView === 'home' || currentView === 'dashboard'} onClick={() => setView('home')} /></li>
                    <li><NavItem icon={<UsersIcon />} label="Personajes" isActive={currentView === 'characters'} onClick={() => setView('characters')} /></li>
                    <li><NavItem icon={<FolderIcon />} label="Proyectos" isActive={currentView === 'projects'} onClick={() => setView('projects')} /></li>
                    <li><NavItem icon={<CrownIcon />} label="Versión Pro" isActive={currentView === 'pro'} onClick={() => setView('pro')} /></li>
                </ul>
            </nav>
            <div className="flex-grow flex flex-col min-h-0">
                {renderContextualMenu()}
            </div>
        </aside>
    );
};

export default Sidebar;