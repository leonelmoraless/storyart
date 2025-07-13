import React from 'react';
import type { Character } from '../types';
import CharacterCard from '../components/CharacterCard';
import { EmptyCharacters } from '../components/EmptyState';

interface CharactersProps {
    characters: Character[];
    onDeleteCharacter: (character: Character) => void;
    onEditCharacter: (character: Character) => void;
    onGenerateCharacter: () => void;
}

const Characters: React.FC<CharactersProps> = ({ characters, onDeleteCharacter, onEditCharacter, onGenerateCharacter }) => {
    
    if (characters.length === 0) {
        return <EmptyCharacters onCreateCharacter={onGenerateCharacter} />;
    }
    
    return (
        <div className="text-white p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Personajes</h2>
                <p className="text-slate-400 mt-1">Gestiona tus personajes creados</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {characters.map(char => (
                    <CharacterCard 
                        key={char.id} 
                        character={char} 
                        onDelete={() => onDeleteCharacter(char)}
                        onEdit={() => onEditCharacter(char)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Characters;