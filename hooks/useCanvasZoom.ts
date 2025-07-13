import { useState, useCallback, useEffect } from 'react';

export interface ZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const useCanvasZoom = (initialScale: number = 1) => {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: initialScale,
    offsetX: 0,
    offsetY: 0
  });

  const zoomIn = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 3) // Máximo 300%
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.3) // Mínimo 30%
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomState({
      scale: 1,
      offsetX: 0,
      offsetY: 0
    });
  }, []);

  const setZoom = useCallback((scale: number) => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, scale))
    }));
  }, []);

  const pan = useCallback((deltaX: number, deltaY: number) => {
    setZoomState(prev => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY
    }));
  }, []);

  // Manejar zoom con rueda del mouse
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomState(prev => ({
        ...prev,
        scale: Math.max(0.3, Math.min(3, prev.scale + delta))
      }));
    }
  }, []);

  // Atajos de teclado para zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    }
  }, [zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getTransformStyle = useCallback(() => ({
    transform: `scale(${zoomState.scale}) translate(${zoomState.offsetX}px, ${zoomState.offsetY}px)`,
    transformOrigin: 'center center'
  }), [zoomState]);

  return {
    zoomState,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    pan,
    handleWheel,
    getTransformStyle,
    zoomPercentage: Math.round(zoomState.scale * 100)
  };
};