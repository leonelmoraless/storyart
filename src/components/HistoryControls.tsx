import React from 'react';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  historySize: number;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  historySize
}) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-2">
      {/* Botón Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`Deshacer (Ctrl + Z) - ${historySize} acciones disponibles`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      {/* Botón Redo */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Rehacer (Ctrl + Y)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
        </svg>
      </button>

      {/* Indicador de historial */}
      <div className="text-xs text-gray-400 px-2 border-l border-slate-600">
        {historySize} cambios
      </div>
    </div>
  );
};

export default HistoryControls;