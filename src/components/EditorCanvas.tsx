import React, { useState } from 'react';
import type { Scene, CanvasElement, Character, ImageElement } from '../types';
import CanvasElementComponent from './CanvasElement';
import { generateSceneImage } from '../services/imageService';

interface EditorCanvasProps {
    scene: Scene;
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (element: CanvasElement) => void;
    onAddElement: (element: CanvasElement) => void;
    onSetActiveScene: (sceneId: string) => void;
    onUpdateScene: (scene: Scene) => void;
    onContextMenu: (e: React.MouseEvent, type: 'canvas' | 'element', element?: CanvasElement) => void;
}

const LoadingOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 text-gray-700">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="text-lg font-semibold">Generando fondo...</span>
        </div>
    </div>
);

const EditorCanvas: React.FC<EditorCanvasProps> = ({ scene, elements, selectedElementId, onSelectElement, onUpdateElement, onAddElement, onSetActiveScene, onUpdateScene, onContextMenu }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateBackground = async () => {
        setIsGenerating(true);
        try {
            const newImageUrl = await generateSceneImage(scene.description, scene.artStyle, scene.characters);
            onUpdateScene({ ...scene, imageUrl: newImageUrl });
        } catch (error) {
            console.error("Failed to generate background", error);
        } finally {
            setIsGenerating(false);
        }
    }
    
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onSelectElement(null);
        }
    };
    
    const handleCanvasContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onContextMenu(e, 'canvas');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const characterData = e.dataTransfer.getData('application/json');
        if (characterData) {
            const character: Character = JSON.parse(characterData);
            const parentRect = e.currentTarget.getBoundingClientRect();
            
            const newImageElement: ImageElement = {
                id: `el_${Date.now()}`,
                type: 'image',
                characterId: character.id,
                imageUrl: character.imageUrl,
                x: e.clientX - parentRect.left - 75,
                y: e.clientY - parentRect.top - 75,
                width: 150,
                height: 150,
            };
            onAddElement(newImageElement);
        }
    };

    return (
        <div 
            data-canvas-container
            className="w-full h-full bg-cover bg-center relative overflow-hidden" 
            style={{ backgroundImage: `url(${scene.imageUrl})`, backgroundColor: scene.imageUrl ? '' : '#fff' }}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasContextMenu}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {isGenerating && <LoadingOverlay />}

            {scene.imageUrl || elements.length > 0 ? (
                elements.map(element => (
                    <CanvasElementComponent
                        key={element.id}
                        element={element}
                        onUpdate={onUpdateElement}
                        onSelect={() => onSelectElement(element.id)}
                        isSelected={element.id === selectedElementId}
                        onNavigate={onSetActiveScene}
                        onContextMenu={(e) => onContextMenu(e, 'element', element)}
                    />
                ))
            ) : (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl font-semibold">Lienzo vacío</p>
                    <p className="text-md mt-2 max-w-md mb-4">Genere un fondo basado en la descripción de la escena, o arrastre personajes y añada texto.</p>
                     <button onClick={handleGenerateBackground} disabled={isGenerating || !scene.description} className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-colors">
                        Generar Fondo
                    </button>
                </div>
            )}
            
            {!scene.imageUrl && elements.length > 0 && <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-md -z-10"></div>}
        </div>
    );
};

export default EditorCanvas;