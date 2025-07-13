import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Projects from './pages/Projects';
import ProVersion from './pages/ProVersion';
import Dashboard from './pages/Dashboard';
import GenerateCharacterModal from './components/modals/GenerateCharacterModal';
import EditCharacterModal from './components/modals/EditCharacterModal';
import GenerateSceneModal from './components/modals/GenerateSceneModal';
import StoryFlowModal from './components/modals/StoryFlowModal';
import ConfirmModal from './components/modals/ConfirmModal';
import CreateProjectModal from './components/modals/CreateProjectModal';
import type { Character, Project, Scene } from './types';
import { saveAppState, loadAppState, createAutoBackup, exportProject, exportAllData, importProject, type AppState } from './services/storageService';
import { exportToPDF, previewScene } from './services/exportService';

export type View = 'dashboard' | 'home' | 'characters' | 'projects' | 'pro';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [activeScene, setActiveScene] = useState<Scene | null>(null);
    
    const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);
    const [isSceneModalOpen, setSceneModalOpen] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
    const [isFlowModalOpen, setFlowModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');

    // Cargar estado al iniciar la aplicación
    useEffect(() => {
        const savedState = loadAppState();
        if (savedState) {
            setProjects(savedState.projects);
            setCharacters(savedState.characters);
            setLastSaved(savedState.lastSaved);
            
            // Restaurar proyecto activo
            if (savedState.activeProjectId) {
                const activeProj = savedState.projects.find(p => p.id === savedState.activeProjectId);
                if (activeProj) {
                    setActiveProject(activeProj);
                    if (savedState.activeSceneId) {
                        const activeScn = activeProj.scenes.find(s => s.id === savedState.activeSceneId);
                        if (activeScn) setActiveScene(activeScn);
                    }
                }
            }
        }
    }, []);

    // Auto-guardado cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            const currentState: AppState = {
                projects,
                characters,
                activeProjectId: activeProject?.id || null,
                activeSceneId: activeScene?.id || null,
                lastSaved: new Date().toISOString()
            };
            saveAppState(currentState);
            setLastSaved(currentState.lastSaved);
        }, 30000); // 30 segundos

        return () => clearInterval(interval);
    }, [projects, characters, activeProject?.id, activeScene?.id]);

    // Backup automático cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            const currentState: AppState = {
                projects,
                characters,
                activeProjectId: activeProject?.id || null,
                activeSceneId: activeScene?.id || null,
                lastSaved: new Date().toISOString()
            };
            createAutoBackup(currentState);
        }, 300000); // 5 minutos

        return () => clearInterval(interval);
    }, [projects, characters, activeProject?.id, activeScene?.id]);

    useEffect(() => {
        if (activeProject && !activeProject.scenes.find(s => s.id === activeScene?.id)) {
             setActiveScene(activeProject.scenes[0] || null);
        } else if (!activeProject) {
            setActiveScene(null);
        }
    }, [activeProject, activeScene]);

    const handleSetView = useCallback((newView: View) => {
        if (newView === 'home' && !activeProject) {
            setView('dashboard');
        } else {
            setView(newView);
        }
    }, [activeProject]);
    
    const handleSetActiveScene = useCallback((scene: Scene) => {
        if(activeProject && activeProject.scenes.some(s => s.id === scene.id)) {
            setActiveScene(scene);
        }
    }, [activeProject]);

    const handleAddCharacter = useCallback((character: Character) => {
        setCharacters(prev => [...prev, character]);
    }, []);

    const handleUpdateCharacter = useCallback((updatedCharacter: Character) => {
        setCharacters(prev => prev.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
        setEditingCharacter(null);
    }, []);

    const confirmDeleteCharacter = useCallback(() => {
        if (deletingCharacter) {
            setCharacters(prev => prev.filter(c => c.id !== deletingCharacter.id));
            setDeletingCharacter(null);
        }
    }, [deletingCharacter]);

    const handleUpdateProject = useCallback((updatedProject: Project) => {
        const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
        setProjects(updatedProjects);
        if (activeProject?.id === updatedProject.id) {
            setActiveProject(updatedProject);
        }
    }, [projects, activeProject?.id]);
    
    const handleUpdateScene = useCallback((updatedScene: Scene) => {
        if (!activeProject) return;
        
        const updatedScenes = activeProject.scenes.map(s => s.id === updatedScene.id ? updatedScene : s);
        const updatedProject = { ...activeProject, scenes: updatedScenes };

        setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setActiveProject(updatedProject);
        
        if (activeScene?.id === updatedScene.id) {
            setActiveScene(updatedScene);
        }
    }, [activeProject, activeScene?.id]);

    const handleAddScene = useCallback((scene: Scene) => {
        if(activeProject) {
            const updatedProject = {
                ...activeProject,
                scenes: [...activeProject.scenes, scene]
            };
            handleUpdateProject(updatedProject);
            setActiveScene(scene);
        }
    }, [activeProject, handleUpdateProject]);

    const handleDeleteScene = useCallback((sceneId: string) => {
        if (!activeProject) return;
        const updatedScenes = activeProject.scenes.filter(s => s.id !== sceneId);
        const updatedProject = { ...activeProject, scenes: updatedScenes };
        handleUpdateProject(updatedProject);
    }, [activeProject, handleUpdateProject]);
    
    const handleAddProject = useCallback(() => {
        setCreateProjectModalOpen(true);
    }, []);

    const handleCreateProject = useCallback((name: string) => {
        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name,
            scenes: []
        };
        setProjects(prev => [...prev, newProject]);
        setActiveProject(newProject);
        setView('home');
        setSceneModalOpen(true); // Guide user to create first scene
    }, []);

    // Funciones de exportación
    const handleExportProject = useCallback(async () => {
        if (!activeProject) return;
        try {
            await exportToPDF(activeProject);
        } catch (error) {
            console.error('Error exportando proyecto:', error);
        }
    }, [activeProject]);

    const handlePreviewScene = useCallback(async () => {
        if (!activeScene) return;
        try {
            await previewScene(activeScene);
        } catch (error) {
            console.error('Error previsualizando escena:', error);
        }
    }, [activeScene]);

    const handleExportProjectJSON = useCallback(() => {
        if (!activeProject) return;
        exportProject(activeProject);
    }, [activeProject]);

    const handleExportAllData = useCallback(() => {
        const currentState: AppState = {
            projects,
            characters,
            activeProjectId: activeProject?.id || null,
            activeSceneId: activeScene?.id || null,
            lastSaved: new Date().toISOString()
        };
        exportAllData(currentState);
    }, [projects, characters, activeProject?.id, activeScene?.id]);

    const handleImportProject = useCallback((file: File) => {
        importProject(file)
            .then(project => {
                setProjects(prev => [...prev, project]);
                console.log('Proyecto importado exitosamente');
            })
            .catch(error => {
                console.error('Error importando proyecto:', error);
            });
    }, []);

    const handleDeleteProject = useCallback((projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (activeProject?.id === projectId) {
            setActiveProject(null);
            setView('dashboard');
        }
    }, [activeProject?.id]);

    const handleSetActiveProject = useCallback((project: Project) => {
        setActiveProject(project);
        setView('home');
    }, []);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            projects={projects}
                            onAddProject={handleAddProject}
                            onSetActiveProject={handleSetActiveProject}
                            onGenerateCharacter={() => setCharacterModalOpen(true)}
                            onGenerateScene={() => activeProject ? setSceneModalOpen(true) : handleAddProject()}
                            setView={handleSetView}
                            hasActiveProject={!!activeProject}
                        />;
            case 'home':
                 if (!activeProject) {
                    return <Dashboard 
                                projects={projects}
                                onAddProject={handleAddProject}
                                onSetActiveProject={handleSetActiveProject}
                                onGenerateCharacter={() => setCharacterModalOpen(true)}
                                onGenerateScene={() => activeProject ? setSceneModalOpen(true) : handleAddProject()}
                                setView={handleSetView}
                                hasActiveProject={!!activeProject}
                            />;
                 }
                return <Home activeProject={activeProject} activeScene={activeScene} onUpdateScene={handleUpdateScene} onSetActiveScene={handleSetActiveScene} characters={characters} />;
            case 'characters':
                return <Characters 
                            characters={characters} 
                            onDeleteCharacter={(char) => setDeletingCharacter(char)} 
                            onEditCharacter={(char) => setEditingCharacter(char)}
                            onGenerateCharacter={() => setCharacterModalOpen(true)}
                        />;
            case 'projects':
                return <Projects 
                            projects={projects} 
                            onSetActiveProject={handleSetActiveProject} 
                            onDeleteProject={handleDeleteProject} 
                            onUpdateProject={handleUpdateProject}
                            onAddProject={handleAddProject}
                        />;
            case 'pro':
                return <ProVersion />;
            default:
                return <Dashboard 
                            projects={projects}
                            onAddProject={handleAddProject}
                            onSetActiveProject={handleSetActiveProject}
                            onGenerateCharacter={() => setCharacterModalOpen(true)}
                            onGenerateScene={() => activeProject ? setSceneModalOpen(true) : handleAddProject()}
                            setView={handleSetView}
                            hasActiveProject={!!activeProject}
                        />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen flex font-sans">
            <Sidebar 
                currentView={view} 
                setView={handleSetView}
                projects={projects}
                characters={characters}
                activeProject={activeProject}
                activeScene={activeScene}
                onAddProject={handleAddProject}
                onGenerateCharacter={() => setCharacterModalOpen(true)}
                onGenerateScene={() => setSceneModalOpen(true)}
                onAddScene={() => setSceneModalOpen(true)}
                onSetActiveProject={handleSetActiveProject}
                onSetActiveScene={setActiveScene}
                onUpdateProject={handleUpdateProject}
                onUpdateScene={handleUpdateScene}
                onDeleteScene={handleDeleteScene}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Header 
                    onSave={() => {}} 
                    onShowFlow={() => setFlowModalOpen(true)}
                    onExportPDF={handleExportProject}
                    isFlowVisible={!!activeProject && activeProject.scenes.length > 1}
                    hasScenes={!!activeProject && activeProject.scenes.length > 0}
                />
                <main className="flex-1 bg-slate-900 overflow-y-auto">
                    {renderView()}
                </main>
            </div>

            {isCharacterModalOpen && (
                <GenerateCharacterModal
                    onClose={() => setCharacterModalOpen(false)}
                    onAddCharacter={handleAddCharacter}
                />
            )}

            {editingCharacter && (
                <EditCharacterModal
                    character={editingCharacter}
                    onClose={() => setEditingCharacter(null)}
                    onUpdateCharacter={handleUpdateCharacter}
                />
            )}

            {deletingCharacter && (
                <ConfirmModal
                    isOpen={!!deletingCharacter}
                    onClose={() => setDeletingCharacter(null)}
                    onConfirm={confirmDeleteCharacter}
                    title="Eliminar Personaje"
                    message={`¿Estás seguro de que quieres eliminar a "${deletingCharacter.name}"? Esta acción no se puede deshacer.`}
                />
            )}

            {isSceneModalOpen && activeProject && (
                <GenerateSceneModal
                    onClose={() => setSceneModalOpen(false)}
                    onAddScene={handleAddScene}
                    characters={characters}
                />
            )}

            {isFlowModalOpen && activeProject && (
                <StoryFlowModal
                    project={activeProject}
                    onClose={() => setFlowModalOpen(false)}
                    onNavigate={(sceneId) => {
                        const scene = activeProject.scenes.find(s => s.id === sceneId);
                        if(scene) setActiveScene(scene);
                        setFlowModalOpen(false);
                        setView('home');
                    }}
                />
            )}

            <CreateProjectModal
                isOpen={isCreateProjectModalOpen}
                onClose={() => setCreateProjectModalOpen(false)}
                onCreateProject={handleCreateProject}
            />
        </div>
    );
};

export default App;