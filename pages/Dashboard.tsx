import React from 'react';
import type { Project } from '../types';
import { View } from '../App';
import { EmptyProjects } from '../components/EmptyState';

interface DashboardProps {
    projects: Project[];
    onAddProject: () => void;
    onSetActiveProject: (project: Project) => void;
    onGenerateCharacter: () => void;
    onGenerateScene: () => void;
    setView: (view: View) => void;
    hasActiveProject: boolean;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const UserPlusIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const PaletteIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    iconColor: string;
}> = ({ icon, title, description, buttonText, onClick, iconColor }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col text-center items-center transition-all duration-300 hover:border-violet-500 hover:bg-slate-800">
        <div className={`mb-4 ${iconColor}`}>{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 flex-grow mb-6">{description}</p>
        <button onClick={onClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            {buttonText}
        </button>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onSetActiveProject, onGenerateCharacter, onGenerateScene, setView, hasActiveProject }) => {
    const recentProjects = projects.slice(-5).reverse();

    const handleOpenEditor = () => {
        if (hasActiveProject) {
            setView('home');
        } else if (projects.length > 0) {
            setView('projects');
        } else {
            onAddProject();
        }
    }

    return (
        <div className="text-white p-6 sm:p-10 h-full flex flex-col">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Bienvenido a StoryArt</h1>
                <p className="text-lg text-slate-400">Crea increíbles novelas visuales y cómics con la ayuda de la IA</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <ActionCard 
                    icon={<PlusIcon />}
                    title="Crear Nuevo Proyecto"
                    description="Inicia una nueva historia desde cero."
                    buttonText="Comenzar"
                    onClick={onAddProject}
                    iconColor="text-violet-400"
                />
                 <ActionCard 
                    icon={<UserPlusIcon />}
                    title="Crear Personajes"
                    description="Genera personajes únicos con IA para tus historias."
                    buttonText="Crear Personaje"
                    onClick={onGenerateCharacter}
                    iconColor="text-sky-400"
                />
                 <ActionCard 
                    icon={<SparklesIcon />}
                    title="Generar Escena"
                    description="Crea escenas y fondos impresionantes para tus personajes."
                    buttonText="Generar Escena"
                    onClick={onGenerateScene}
                    iconColor="text-orange-400"
                />
                 <ActionCard 
                    icon={<PaletteIcon />}
                    title="Editar y Personaliza"
                    description="Abre el editor para dar vida a tus escenas."
                    buttonText="Abrir Editor"
                    onClick={handleOpenEditor}
                    iconColor="text-emerald-400"
                />
            </div>

            <div className="flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Proyectos Recientes</h2>
                <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                     {recentProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {recentProjects.map(proj => (
                                <div key={proj.id} onClick={() => onSetActiveProject(proj)} className="bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer border border-slate-700 hover:border-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-semibold truncate w-full">{proj.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                            </svg>
                            <p>No hay proyectos recientes.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;