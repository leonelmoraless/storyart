import React, { useEffect, useRef } from 'react';

type MenuItem = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
} | { type: 'divider' };

export interface ContextMenuOptions {
    x: number;
    y: number;
    options: MenuItem[];
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuOptions> = ({ x, y, options, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        // Add timeout to prevent the same click that opened the menu from closing it
        setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Adjust position if it goes off-screen
    const menuStyle: React.CSSProperties = {
        top: y,
        left: x,
        position: 'absolute',
        zIndex: 100,
    };
    
    // In a real app, you would add logic here to check if menuStyle.top + menuRef.current.offsetHeight > window.innerHeight etc.

    return (
        <div ref={menuRef} style={menuStyle} className="bg-slate-800 border border-slate-600 rounded-md shadow-2xl min-w-[200px] py-1">
            <ul>
                {options.map((option, index) => {
                    if ('type' in option && option.type === 'divider') {
                        return <li key={`divider-${index}`} className="h-px bg-slate-600 my-1"></li>;
                    } else {
                        return (
                            <li key={option.label}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        option.onClick();
                                        onClose();
                                    }}
                                    disabled={option.disabled}
                                    className="w-full flex items-center px-4 py-2 text-sm text-left text-gray-200 hover:bg-violet-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                    {option.label}
                                </button>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
};

export default ContextMenu;