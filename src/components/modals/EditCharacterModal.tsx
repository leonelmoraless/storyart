import React, { useState, useCallback } from 'react';
import type { Character } from '../../types';

interface EditCharacterModalProps {
    onClose: () => void;
    onUpdateCharacter: (character: Character) => void;
    character: Character;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({ onClose, onUpdateCharacter, character }) => {
    const [name, setName] = useState(character.name);
    const [description, setDescription] = useState(character.description);
    const [error, setError] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) {
            setError('El nombre y la descripción son requeridos.');
            return;
        }
        setError('');
        onUpdateCharacter({
            ...character,
            name,
            description,
        });
        onClose();
    }, [name, description, character, onUpdateCharacter, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#0B1120] text-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl font-bold mb-6">Editar Personaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="char-name-edit" className="block text-md font-semibold text-gray-300 mb-2">Nombre del personaje</label>
                        <input
                            id="char-name-edit"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition placeholder-slate-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="char-desc-edit" className="block text-md font-semibold text-gray-300 mb-2">Descripción</label>
                        <textarea
                            id="char-desc-edit"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalle las características..."
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none placeholder-slate-400"
                        />
                    </div>
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-8 py-3 bg-transparent border-2 border-slate-600 font-semibold rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-colors duration-300">Cancelar</button>
                        <button type="submit" className="px-8 py-3 bg-violet-600 font-semibold rounded-lg hover:bg-violet-700 transition-colors duration-300">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCharacterModal;
