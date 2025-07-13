import React, { useState, useEffect, useCallback } from 'react';
import type { Project, Scene, CanvasElement, Character, TextElement, ImageElement } from '../types';
import EditorCanvas from '../components/EditorCanvas';
import EditorSidebar from '../components/DialogueGenerator';
import BottomToolbar from '../components/DrawingToolbar';
import ContextMenu, { type ContextMenuOptions } from '../components/modals/ContextMenu';
import { previewScene } from '../services/exportService';

interface HomeProps {
    activeProject: Project | null;
    activeScene: Scene | null;
    characters: Character[];
    onUpdateScene: (scene: Scene) => void;
    onSetActiveScene: (scene: Scene) => void;
}

const Home: React.FC<HomeProps> = ({ activeProject, activeScene, characters, onUpdateScene, onSetActiveScene }) => {
    const [history, setHistory] = useState<CanvasElement[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuOptions | null>(null);
    const [clipboard, setClipboard] = useState<CanvasElement | null>(null);

    useEffect(() => {
        if (activeScene) {
            setHistory([activeScene.elements]);
            setHistoryIndex(0);
            setSelectedElementId(null);
        } else {
            setHistory([]);
            setHistoryIndex(-1);
        }
    }, [activeScene?.id]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    const currentElements = history[historyIndex] || [];
    const selectedElement = currentElements.find(el => el.id === selectedElementId) || null;

    const updateElements = useCallback((newElements: CanvasElement[], fromHistory = false) => {
        if (!activeScene) return;

        if (!fromHistory) {
            const newHistory = [...history.slice(0, historyIndex + 1), newElements];
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
        onUpdateScene({ ...activeScene, elements: newElements });
    }, [history, historyIndex, activeScene, onUpdateScene]);

    const handleUndo = useCallback(() => {
        if (canUndo) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            updateElements(history[newIndex], true);
            setSelectedElementId(null);
        }
    }, [canUndo, history, historyIndex, updateElements]);

    const handleRedo = useCallback(() => {
        if (canRedo) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            updateElements(history[newIndex], true);
            setSelectedElementId(null);
        }
    }, [canRedo, history, historyIndex, updateElements]);

    const addElement = (element: CanvasElement) => {
        const newElements = [...currentElements, element];
        updateElements(newElements);
        setSelectedElementId(element.id);
    };

    const updateSingleElement = (updatedElement: CanvasElement) => {
        const newElements = currentElements.map(el => (el.id === updatedElement.id ? updatedElement : el));
        updateElements(newElements);
    };

    const deleteElement = useCallback((elementId: string) => {
        const newElements = currentElements.filter(el => el.id !== elementId);
        updateElements(newElements);
        setSelectedElementId(null);
    }, [currentElements, updateElements]);
    
    const bringToFront = (elementId: string) => {
      const element = currentElements.find(e => e.id === elementId);
      if (!element) return;
      const others = currentElements.filter(e => e.id !== elementId);
      updateElements([...others, element]);
      setSelectedElementId(elementId);
    };

    const sendToBack = (elementId: string) => {
        const element = currentElements.find(e => e.id === elementId);
        if (!element) return;
        const others = currentElements.filter(e => e.id !== elementId);
        updateElements([element, ...others]);
        setSelectedElementId(elementId);
    };

    const handleCopy = useCallback(() => {
        if (selectedElement) {
            setClipboard(JSON.parse(JSON.stringify(selectedElement))); // Deep copy
        }
    }, [selectedElement]);

    const handlePaste = useCallback((pos: {x: number, y: number}) => {
        if (clipboard) {
            const newElement = {
                ...JSON.parse(JSON.stringify(clipboard)),
                id: `el_${Date.now()}`,
                x: pos.x,
                y: pos.y,
            };
            addElement(newElement);
        }
    }, [clipboard, addElement]);
    
    const handleContextMenu = useCallback((e: React.MouseEvent, type: 'canvas' | 'element', element?: CanvasElement) => {
        e.preventDefault();
        e.stopPropagation();

        let options = [];
        const pasteOption = { label: 'Pegar', onClick: () => handlePaste({x: e.clientX, y: e.clientY}), disabled: !clipboard };
        
        if (type === 'element' && element) {
            setSelectedElementId(element.id);
            options = [
                { label: 'Copiar', onClick: handleCopy },
                { label: 'Eliminar', onClick: () => deleteElement(element.id) },
                { type: 'divider' },
                { label: 'Traer al frente', onClick: () => bringToFront(element.id) },
                { label: 'Enviar al fondo', onClick: () => sendToBack(element.id) },
            ];
             if(element.type === 'text') {
                options.unshift({ label: 'Editar Texto', onClick: () => {
                     // This is handled by double-clicking in the component, but could be triggered here
                }});
            }
        } else { // canvas
            options = [
                pasteOption,
                { type: 'divider' },
                { label: 'Añadir bocadillo de diálogo', onClick: () => addShapeElement('speech-bubble', {x: e.clientX, y: e.clientY}) },
                { label: 'Añadir bocadillo de pensamiento', onClick: () => addShapeElement('thought-bubble', {x: e.clientX, y: e.clientY}) },
                { label: 'Añadir bocadillo de grito', onClick: () => addShapeElement('shout-bubble', {x: e.clientX, y: e.clientY}) },
                { label: 'Añadir caja de texto', onClick: () => addShapeElement('rectangle', {x: e.clientX, y: e.clientY}) },
            ];
        }

        setContextMenu({ x: e.pageX, y: e.pageY, options, onClose: () => setContextMenu(null) });

    }, [clipboard, handleCopy, handlePaste, deleteElement, bringToFront, sendToBack]);
    
     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName.toLowerCase() === 'input' || (e.target as HTMLElement).tagName.toLowerCase() === 'textarea') {
                return;
            }
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isCtrl = isMac ? e.metaKey : e.ctrlKey;

            if (isCtrl && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                handleUndo();
            } else if (isCtrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            } else if (selectedElement) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    deleteElement(selectedElement.id);
                } else if (isCtrl && e.key.toLowerCase() === 'c') {
                    e.preventDefault();
                    handleCopy();
                }
            }
             if (isCtrl && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                // We don't have mouse position here, so we paste at a default offset.
                handlePaste({ x: 10, y: 10 });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, handleUndo, handleRedo, deleteElement, handleCopy, handlePaste]);
    

    const addShapeElement = (shape: TextElement['shape'], pos?: {x: number, y: number}, initialContent?: string) => {
        const newTextElement: TextElement = {
           id: `el_${Date.now()}`, type: 'text', shape, 
           content: initialContent || 'Doble clic para editar...',
           x: pos?.x || 50, y: pos?.y || 50, width: 250, height: 100,
           style: { color: '#000000', backgroundColor: '#ffffff', fontSize: 16, fontFamily: 'Arial', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' },
        };
        addElement(newTextElement);
    };

    const addShapeElementFromSidebar = (shape: TextElement['shape'], initialContent?: string) => {
        addShapeElement(shape, { x: 50, y: 50 }, initialContent);
    };

    const clearCanvas = () => {
        updateElements([]);
        setSelectedElementId(null);
    }
    
    if (!activeProject) {
        return null;
    }
    
    if (!activeScene) {
        return <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l-2.293-2.293a1 1 0 010-1.414l7-7a1 1 0 011.414 0l7 7a1 1 0 010 1.414L17 21m-7-3a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg><h2 className="text-2xl font-bold">Proyecto vacío</h2><p className="mt-2">Usa el botón "Añadir Nueva Escena" o "Generar Escena (IA)" en la barra lateral para empezar.</p></div>;
    }

    return (
        <div className="flex h-full gap-4 p-4 sm:p-6 lg:p-8" onClick={() => setContextMenu(null)}>
            <div className="flex-1 flex flex-col bg-[#0B1120] rounded-lg shadow-2xl overflow-hidden border border-slate-700">
                <div className="flex-1 bg-white relative">
                    <EditorCanvas 
                        scene={activeScene}
                        elements={currentElements}
                        selectedElementId={selectedElementId}
                        onSelectElement={setSelectedElementId}
                        onUpdateElement={updateSingleElement}
                        onAddElement={addElement}
                        onUpdateScene={onUpdateScene}
                        onContextMenu={handleContextMenu}
                        onSetActiveScene={(sceneId) => {
                            const nextScene = activeProject.scenes.find(s => s.id === sceneId);
                            if (nextScene) onSetActiveScene(nextScene);
                        }}
                    />
                </div>
                <div className="flex-shrink-0">
                    <BottomToolbar
                        selectedElement={selectedElement}
                        onUpdateElement={updateSingleElement}
                        onBringToFront={() => selectedElementId && bringToFront(selectedElementId)}
                        onSendToBack={() => selectedElementId && sendToBack(selectedElementId)}
                    />
                </div>
            </div>
            <aside className="w-80 flex-shrink-0">
                <EditorSidebar
                    scene={activeScene}
                    onUpdateScene={onUpdateScene}
                    onAddElement={addShapeElementFromSidebar}
                    onClearCanvas={clearCanvas}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                />
            </aside>
            {contextMenu && <ContextMenu {...contextMenu} />}
        </div>
    );
};

export default Home;