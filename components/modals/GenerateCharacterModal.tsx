import React, { useState, useCallback } from 'react';
import { ART_STYLES, ART_STYLE_LABELS } from '../../constants';
import { ArtStyle, type Character } from '../../types';
import { generateCharacterImage } from '../../services/imageService';

interface GenerateCharacterModalProps {
    onClose: () => void;
    onAddCharacter: (character: Character) => void;
}

const GenerateCharacterModal: React.FC<GenerateCharacterModalProps> = ({ onClose, onAddCharacter }) => {
    const [name, setName] = useState(`Personaje ${Date.now() % 1000}`);
    const [description, setDescription] = useState('');
    const [artStyle, setArtStyle] = useState<ArtStyle | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !artStyle) {
            setError('Todos los campos son requeridos.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const imageUrl = await generateCharacterImage(description, artStyle);
            const newCharacter: Character = {
                id: `char_${Date.now()}`,
                name,
                description,
                artStyle,
                imageUrl,
            };
            onAddCharacter(newCharacter);
            onClose();
        } catch (err) {
            setError('Error al generar el personaje. Inténtelo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [name, description, artStyle, onAddCharacter, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#0B1120] text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl font-bold mb-6">Generar Personaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="char-name" className="block text-md font-semibold text-gray-300 mb-2">Nombre del personaje</label>
                        <input
                            id="char-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Samurai Warrior, Elven Mage, Robot Guardian..."
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition placeholder-slate-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="char-desc" className="block text-md font-semibold text-gray-300 mb-2">Descripción</label>
                        <textarea
                            id="char-desc"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: samurai, warrior, mage, robot, dragon (palabras clave en inglés)"
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none placeholder-slate-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">💡 Usa palabras clave como: samurai, warrior, mage, robot, dragon</p>
                    </div>
                    <div>
                        <label htmlFor="art-style" className="block text-md font-semibold text-gray-300 mb-2">Estilo de Arte</label>
                         <div className="relative">
                            <select
                                id="art-style"
                                value={artStyle}
                                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                                required
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition appearance-none"
                            >
                                <option value="" disabled>Seleccione una...</option>
                                {ART_STYLES.map(style => <option key={style} value={style}>{ART_STYLE_LABELS[style]}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <div className="bg-black rounded-full w-7 h-7 flex items-center justify-center">
                                    <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" clipRule="evenodd" fillRule="evenodd"/></svg>
                                </div>
                            </div>
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

export default GenerateCharacterModal;