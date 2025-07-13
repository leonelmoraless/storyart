import React, { useState, useCallback, useEffect } from 'react';
import { generateDialogue } from '../services/geminiService';
import { previewScene } from '../services/exportService';
import type { Scene, TextElement } from '../types';

interface EditorSidebarProps {
    scene: Scene;
    onUpdateScene: (scene: Scene) => void;
    onAddElement: (shape: TextElement['shape'], initialContent?: string) => void;
    onClearCanvas: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const ToolButton: React.FC<{ title: string, onClick: () => void, children: React.ReactNode }> = ({ title, onClick, children }) => (
    <button onClick={onClick} title={title} className="p-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 flex items-center justify-center aspect-square transition-colors">
        {children}
    </button>
);


const EditorSidebar: React.FC<EditorSidebarProps> = ({ scene, onUpdateScene, onAddElement, onClearCanvas, onUndo, onRedo, canUndo, canRedo }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedDialogues, setGeneratedDialogues] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    
    const handleGenerate = useCallback(async () => {
        const currentSummary = scene.description;
        if (!currentSummary.trim()) return;
        setIsLoading(true);
        setGeneratedDialogues([]);
        try {
            const dialogues = await generateDialogue(currentSummary);
            setGeneratedDialogues(dialogues);
        } catch (error) {
            console.error("Failed to generate dialogues:", error);
            setGeneratedDialogues([]);
        } finally {
            setIsLoading(false);
        }
    }, [scene.description]);

    useEffect(() => {
        setSummary(scene.description);
        setGeneratedDialogues([]);
    }, [scene.id, scene.description]);

    const addDialogueToScene = (text: string) => {
        onAddElement('speech-bubble', text);
    };

    const handleCopyText = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => {
            setCopiedIndex(null);
        }, 2000);
    };


    return (
        <div className="bg-slate-800 text-gray-200 rounded-lg p-4 h-full flex flex-col space-y-4">
            {/* Dialogue Generator */}
            <div className="border-b border-slate-700 pb-4">
                <h3 className="text-lg font-bold text-gray-100 mb-2">Generador de diálogos/Narrativa (IA)</h3>
                <div>
                    <label htmlFor="scene-summary" className="block text-sm font-medium text-gray-300 mb-1">Resumen de la escena:</label>
                    <textarea id="scene-summary" rows={3} value={summary} onChange={(e) => onUpdateScene({...scene, description: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none placeholder-slate-400 text-white" placeholder="Describe la escena aquí..." />
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !summary.trim()} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                    {isLoading ? (<> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Generando...</>) 
                    : (<><GenerateIcon className="mr-2" />Generar diálogo (IA)</>)}
                </button>
            </div>
            
            {/* Generated Dialogues */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                 {generatedDialogues.map((dialogue, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-3 text-sm group relative">
                        <div onClick={() => addDialogueToScene(dialogue)} className="cursor-pointer hover:text-violet-300 pr-8">
                            <span className="font-semibold text-gray-400">Ejemplo {index + 1}: </span> {dialogue}
                        </div>
                        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyText(dialogue, index);
                                }}
                                className="p-1.5 bg-slate-800/50 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                title="Copiar texto"
                            >
                                {copiedIndex === index ? (
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {copiedIndex === index && <div className="absolute bottom-1 right-1 text-xs text-green-400 font-bold">¡Copiado!</div>}
                    </div>
                ))}
                 {isLoading && generatedDialogues.length === 0 && Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="animate-pulse bg-slate-700 rounded-lg p-3 h-16 w-full"></div>
                ))}
            </div>

            {/* Canvas Tools */}
            <div className="border-t border-slate-700 pt-4 space-y-3">
                <h3 className="text-lg font-bold text-gray-100">Herramientas</h3>
                <div className="grid grid-cols-4 gap-2">
                     <ToolButton title="Añadir bocadillo de diálogo" onClick={() => onAddElement('speech-bubble')}><svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg></ToolButton>
                     <ToolButton title="Añadir burbuja de pensamiento" onClick={() => onAddElement('thought-bubble')}><svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 112 0 1 1 0 01-2 0zM13 9a1 1 0 112 0 1 1 0 01-2 0z" /></svg></ToolButton>
                     <ToolButton title="Añadir bocadillo de grito" onClick={() => onAddElement('shout-bubble')}><svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.22 8.22a.75.75 0 001.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 7.28 6.22a.75.75 0 00-1.06 1.06L8.94 10 6.22 12.72a.75.75 0 001.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 7.28 6.22z" clipRule="evenodd" /></svg></ToolButton>
                     <ToolButton title="Añadir caja de texto" onClick={() => onAddElement('rectangle')}><svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" /></svg></ToolButton>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={onUndo} disabled={!canUndo} className="py-2 px-4 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Deshacer
                    </button>
                     <button onClick={onRedo} disabled={!canRedo} className="py-2 px-4 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        Rehacer
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                     </button>
                    <button onClick={onClearCanvas} className="col-span-2 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Limpiar lienzo
                    </button>
                    <button 
                        onClick={() => previewScene(scene)} 
                        className="col-span-2 py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 flex items-center justify-center"
                        title="Vista previa de cómo se verá esta escena en el PDF"
                    >
                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                        Vista Previa Escena
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorSidebar;