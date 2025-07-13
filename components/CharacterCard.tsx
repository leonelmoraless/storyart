import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
    character: Character;
    onDelete: () => void;
    onEdit: () => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);


const CharacterCard: React.FC<CharacterCardProps> = ({ character, onDelete, onEdit }) => {
    return (
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden group relative text-white flex flex-col border border-slate-700 hover:border-violet-500 transition-all">
            <div className="relative">
                <img src={character.imageUrl} alt={character.name} className="w-full h-auto aspect-square object-cover bg-slate-700" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-black/50 rounded-full hover:bg-black/75 text-red-500 backdrop-blur-sm">
                        <TrashIcon />
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold truncate">{character.name}</h3>
                <p className="text-sm text-slate-400 flex-grow my-2 line-clamp-2">{character.description}</p>
                <button 
                    onClick={onEdit}
                    className="w-full mt-auto py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    Editar
                </button>
            </div>
        </div>
    );
};

export default CharacterCard;