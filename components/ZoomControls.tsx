import React from 'react';

interface ZoomControlsProps {
  zoomPercentage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSetZoom: (scale: number) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomPercentage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSetZoom
}) => {
  const presetZooms = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-2">
      {/* Botón Zoom Out */}
      <button
        onClick={onZoomOut}
        disabled={zoomPercentage <= 30}
        className="p-1 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Alejar (Ctrl + -)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      {/* Selector de Zoom */}
      <select
        value={zoomPercentage}
        onChange={(e) => onSetZoom(parseInt(e.target.value) / 100)}
        className="bg-slate-600 text-white text-sm rounded px-2 py-1 min-w-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {presetZooms.map(zoom => (
          <option key={zoom} value={zoom}>
            {zoom}%
          </option>
        ))}
        {!presetZooms.includes(zoomPercentage) && (
          <option value={zoomPercentage}>
            {zoomPercentage}%
          </option>
        )}
      </select>

      {/* Botón Zoom In */}
      <button
        onClick={onZoomIn}
        disabled={zoomPercentage >= 300}
        className="p-1 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Acercar (Ctrl + +)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Botón Reset */}
      <button
        onClick={onResetZoom}
        className="p-1 rounded hover:bg-slate-600 transition-colors text-xs px-2"
        title="Restablecer zoom (Ctrl + 0)"
      >
        Ajustar
      </button>

      {/* Indicador de atajos */}
      <div className="text-xs text-gray-400 ml-2 hidden lg:block">
        Ctrl + rueda del mouse
      </div>
    </div>
  );
};

export default ZoomControls;