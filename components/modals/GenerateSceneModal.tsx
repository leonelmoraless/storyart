import React, { useState, useCallback } from 'react';
import { ART_STYLES, ART_STYLE_LABELS } from '../../constants';
import { ArtStyle, type Character, type Scene } from '../../types';
import { generateSceneImage } from '../../services/imageService';

interface GenerateSceneModalProps {
    onClose: () => void;
    onAddScene: (scene: Scene) => void;
    characters: Character[];
}

const GenerateSceneModal: React.FC<GenerateSceneModalProps> = ({ onClose, onAddScene, characters }) => {
    const [description, setDescription] = useState('');
    const [artStyle, setArtStyle] = useState<ArtStyle>(ART_STYLES[0]);
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleCharacter = (char: Character) => {
        setSelectedCharacters(prev => 
            prev.find(c => c.id === char.id) 
            ? prev.filter(c => c.id !== char.id) 
            : [...prev, char]
        );
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) {
            setError('La descripción es requerida.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const imageUrl = await generateSceneImage(description, artStyle, selectedCharacters);
            const newScene: Scene = {
                id: `scene_${Date.now()}`,
                name: description.substring(0, 30) || "Nueva Escena",
                description,
                imageUrl,
                artStyle, // Save the art style with the scene
                dialogues: [],
                characters: selectedCharacters,
                elements: [], // Initialize with empty elements
            };
            onAddScene(newScene);
            onClose();
        } catch (err) {
            setError('Error al generar la escena. Inténtelo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [description, artStyle, selectedCharacters, onAddScene, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#0B1120] text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6">Generar Escena</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="scene-desc" className="block text-md font-semibold text-gray-300 mb-2">Descripción</label>
                        <textarea
                            id="scene-desc"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: forest, castle, city, beach, mountain (palabras clave en inglés)"
                             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none placeholder-slate-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">💡 Usa palabras clave como: forest, castle, city, beach, mountain</p>
                    </div>
                    <div>
                        <label htmlFor="art-style" className="block text-md font-semibold text-gray-300 mb-2">Estilo de Arte</label>
                         <div className="relative">
                            <select
                                id="art-style"
                                value={artStyle}
                                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition appearance-none"
                            >
                                {ART_STYLES.map(style => <option key={style} value={style}>{ART_STYLE_LABELS[style]}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <div className="bg-black rounded-full w-7 h-7 flex items-center justify-center">
                                    <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" clipRule="evenodd" fillRule="evenodd"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-gray-300 mb-2">Seleccionar personajes para escena</label>
                        <div className="flex flex-wrap gap-2">
                            {characters.map(char => (
                                <button type="button" key={char.id} onClick={() => toggleCharacter(char)}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold border-2 transition-colors ${
                                        selectedCharacters.find(c => c.id === char.id) 
                                        ? 'bg-blue-500 border-blue-500 text-white' 
                                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                                    }`}
                                >
                                    {char.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-8 py-3 bg-transparent border-2 border-slate-600 font-semibold rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-colors duration-300">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-violet-600 font-semibold rounded-lg hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center">
                             {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isLoading ? 'Generando...' : 'Generar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateSceneModal;