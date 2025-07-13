import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CanvasElement, TextElement, ImageElement } from '../types';

interface CanvasElementProps {
    element: CanvasElement;
    onUpdate: (element: CanvasElement) => void;
    onSelect: () => void;
    isSelected: boolean;
    onNavigate: (sceneId: string) => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5a.5.5 0 00.707-.707l-1.5-1.5a4 4 0 00-5.656 5.656l3 3a4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a.5.5 0 10.707.707l1.5-1.5z" clipRule="evenodd" />
  </svg>
);

const ResizeHandle: React.FC<{onMouseDown: (e: React.MouseEvent) => void}> = ({ onMouseDown }) => (
    <div 
        onMouseDown={onMouseDown}
        className="element-control absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-se-resize"
    />
);

const getBubblePath = (shape: TextElement['shape'], w: number, h: number): string => {
    switch(shape) {
        case 'speech-bubble':
            return `M 20,0 H ${w-10} C ${w},0 ${w},0 ${w},10 V ${h-10} C ${w},${h} ${w},${h} ${w-10},${h} H 40 L 25,${h+20} L 30,${h} H 10 C 0,${h} 0,${h} 0,${h-10} V 10 C 0,0 0,0 10,0 Z`;
        case 'thought-bubble':
            return `M 20,10 C 5,10 5,30 20,30 H ${w-20} C ${w-5},30 ${w-5},10 ${w-20},10 Z M 15,${h-15} a 10 10 0 0 1 10 10 M 20,${h-10} a 15 15 0 0 1 15 15`; // Simplified cloud
        case 'shout-bubble':
            // Jagged, explosive shape
            let path = 'M ';
            const points = 16;
            for(let i=0; i<points; i++) {
                const angle = (i / points) * 2 * Math.PI;
                const radius = i % 2 === 0 ? w/2 : w/2.2;
                const x = w/2 + Math.cos(angle) * radius;
                const y = h/2 + Math.sin(angle) * radius;
                path += `${x},${y} L `;
            }
            return path.slice(0, -2) + ' Z';
        default: // rectangle
            return `M 0,0 H ${w} V ${h} H 0 Z`;
    }
}


const CanvasElementComponent: React.FC<CanvasElementProps> = ({ element, onUpdate, onSelect, isSelected, onContextMenu, onNavigate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(element.type === 'text' ? element.content : '');
    
    const dragRef = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Editing Logic
    useEffect(() => {
        if (isEditing && element.type === 'text') {
            textareaRef.current?.focus();
            textareaRef.current?.select();
        }
    }, [isEditing, element.type]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (element.type !== 'text' || (e.target as HTMLElement).closest('.element-control')) return;
        setIsEditing(true);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditText(e.target.value);
    };

    const handleTextBlur = () => {
        setIsEditing(false);
        if (element.type === 'text') {
            onUpdate({ ...element, content: editText });
        }
    };
    
    // Drag & Resize Logic
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if(isEditing) return;
        onSelect();
        
        if ((e.target as HTMLElement).closest('.element-control')) {
            return;
        }

        setIsDragging(true);
        dragRef.current = { x: e.clientX - element.x, y: e.clientY - element.y };
        e.preventDefault();
        e.stopPropagation();
    };

    const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        dragRef.current = { x: e.clientX, y: e.clientY };
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!nodeRef.current) return;
        const parentRect = nodeRef.current.parentElement?.getBoundingClientRect();
        if(!parentRect) return;

        if (isDragging) {
            let newX = e.clientX - dragRef.current.x;
            let newY = e.clientY - dragRef.current.y;
            newX = Math.max(0, Math.min(newX, parentRect.width - element.width));
            newY = Math.max(0, Math.min(newY, parentRect.height - element.height));
            onUpdate({ ...element, x: newX, y: newY });
        } else if (isResizing) {
            const dx = e.clientX - dragRef.current.x;
            const dy = e.clientY - dragRef.current.y;
            dragRef.current = { x: e.clientX, y: e.clientY };
            const newWidth = Math.max(50, element.width + dx);
            const newHeight = Math.max(50, element.height + dy);
            onUpdate({ ...element, width: newWidth, height: newHeight });
        }
    }, [isDragging, isResizing, element, onUpdate]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);


    // Styling & Rendering
    const style: React.CSSProperties = {
        transform: `translate(${element.x}px, ${element.y}px)`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
    };
    
    const renderContent = () => {
        if (element.type === 'image') {
            return (
                 <div style={{ outline: isSelected ? '2px solid #3B82F6' : 'none', outlineOffset: '2px', width: '100%', height: '100%' }}>
                    <img src={element.imageUrl} alt="character" className="w-full h-full object-contain" draggable="false" />
                </div>
            );
        }
        
        const textElement = element as TextElement;
        const textStyle: React.CSSProperties = {
            color: textElement.style.color,
            fontSize: `${textElement.style.fontSize}px`,
            fontFamily: textElement.style.fontFamily,
            fontWeight: textElement.style.fontWeight,
            fontStyle: textElement.style.fontStyle,
        };

        const path = getBubblePath(textElement.shape, textElement.width, textElement.height);

        return (
             <svg width={element.width + 20} height={element.height + 30} viewBox={`-5 -5 ${element.width+10} ${element.height+30}`} style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
                    </filter>
                </defs>
                <path d={path} fill={textElement.style.backgroundColor} stroke={isSelected ? '#3B82F6' : '#1f2937'} strokeWidth="2" filter="url(#shadow)" />
                <foreignObject x="5" y="5" width={element.width-10} height={element.height-10}>
                    {isEditing ? (
                        <textarea ref={textareaRef} value={editText} onChange={handleTextChange} onBlur={handleTextBlur}
                            className="w-full h-full bg-transparent border-0 outline-none resize-none p-2"
                            style={textStyle}/>
                    ) : (
                        <div className="w-full h-full select-none whitespace-pre-wrap break-words overflow-hidden p-2" style={textStyle}>
                            {textElement.content}
                        </div>
                    )}
                </foreignObject>
            </svg>
        );
    };

    return (
        <div ref={nodeRef} style={style} onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick} onContextMenu={onContextMenu}>
            {renderContent()}
            {isSelected && (
                <>
                    {element.nextSceneId && (
                        <div className="element-control absolute -top-3 -right-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                            title="Ir a la escena enlazada"
                            onClick={() => onNavigate(element.nextSceneId!)}>
                            <LinkIcon />
                        </div>
                    )}
                    <ResizeHandle onMouseDown={handleResizeMouseDown} />
                </>
            )}
        </div>
    );
};

export default CanvasElementComponent;