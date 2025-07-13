import React, { useCallback } from 'react';
import type { CanvasElement, TextElement } from '../types';

const ColorSwatch: React.FC<{ color: string; onClick: (color: string) => void; isSelected: boolean }> = ({ color, onClick, isSelected }) => (
    <button 
        className={`w-6 h-6 rounded-md border-2 shadow transition-transform hover:scale-110 ${isSelected ? 'border-blue-500 scale-110' : 'border-white'}`}
        style={{ backgroundColor: color }}
        onClick={() => onClick(color)}
    ></button>
);

interface BottomToolbarProps {
    selectedElement: CanvasElement | null;
    onUpdateElement: (element: CanvasElement) => void;
    onBringToFront: () => void;
    onSendToBack: () => void;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ selectedElement, onUpdateElement, onBringToFront, onSendToBack }) => {
    const textColors = ['#000000', '#FFFFFF', '#EF4444', '#22C55E', '#3B82F6', '#EAB308', '#8B5CF6', '#EC4899', '#6B7280', '#F97316', '#A3E635', '#2DD4BF'];
    const fontFamilies = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS', 'Impact'];

    const isTextSelected = selectedElement?.type === 'text';
    const textElement = isTextSelected ? (selectedElement as TextElement) : null;

    const handleStyleChange = useCallback((prop: keyof TextElement['style'], value: any) => {
        if (textElement) {
            onUpdateElement({
                ...textElement,
                style: { ...textElement.style, [prop]: value },
            });
        }
    }, [textElement, onUpdateElement]);

    const handleSizeChange = (increment: number) => {
        if (textElement) {
            handleStyleChange('fontSize', Math.max(8, textElement.style.fontSize + increment));
        }
    }

    return (
        <div className="bg-[#0B1120] p-2 flex items-center justify-between text-white flex-wrap gap-4 border-t border-slate-700">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                     <span className="text-sm font-medium">Tamaño:</span>
                     <button onClick={() => handleSizeChange(-1)} disabled={!isTextSelected} className="px-2 py-1 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50">-</button>
                     <input 
                        type="number" 
                        value={textElement?.style.fontSize || 16}
                        onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                        className="w-14 text-center bg-slate-800 border border-slate-600 rounded-md p-1"
                        disabled={!isTextSelected}
                     />
                     <button onClick={() => handleSizeChange(1)} disabled={!isTextSelected} className="px-2 py-1 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50">+</button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Fuente:</span>
                    <select value={textElement?.style.fontFamily || ''} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} disabled={!isTextSelected} className="text-sm bg-slate-800 border border-slate-600 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50">
                        {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onBringToFront} disabled={!selectedElement} className="p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50" title="Traer al frente">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v1h4a1 1 0 011 1v4h1a1 1 0 010 2h-1v4a1 1 0 01-1 1h-4v1a1 1 0 01-2 0v-1H6a1 1 0 01-1-1v-4H4a1 1 0 110-2h1V6a1 1 0 011-1h4V4a1 1 0 011-1z" /></svg>
                    </button>
                    <button onClick={onSendToBack} disabled={!selectedElement} className="p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50" title="Enviar al fondo">
                       <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v4H2a1 1 0 100 2h1v4a1 1 0 001 1h4v1a1 1 0 102 0v-1h4a1 1 0 001-1v-4h1a1 1 0 100-2h-1V6a1 1 0 00-1-1h-4V3a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium">Color:</span>
                {textColors.map(color => <ColorSwatch key={color} color={color} onClick={(c) => handleStyleChange('color', c)} isSelected={isTextSelected && textElement?.style.color === color} />)}
            </div>
        </div>
    );
};

export default BottomToolbar;