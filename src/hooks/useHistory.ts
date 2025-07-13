import { useState, useCallback, useEffect } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useHistory = <T>(initialState: T, maxHistorySize: number = 50) => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory(prev => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory(prev => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, [canRedo]);

  const pushToHistory = useCallback((newState: T) => {
    setHistory(prev => {
      // No agregar al historial si el estado no ha cambiado
      if (JSON.stringify(prev.present) === JSON.stringify(newState)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      
      // Limitar el tamaño del historial
      if (newPast.length > maxHistorySize) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newState,
        future: [] // Limpiar el futuro cuando se hace un cambio
      };
    });
  }, [maxHistorySize]);

  const clearHistory = useCallback(() => {
    setHistory(prev => ({
      past: [],
      present: prev.present,
      future: []
    }));
  }, []);

  const replacePresent = useCallback((newState: T) => {
    setHistory(prev => ({
      ...prev,
      present: newState
    }));
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: history.present,
    canUndo,
    canRedo,
    undo,
    redo,
    pushToHistory,
    clearHistory,
    replacePresent,
    historySize: history.past.length
  };
};