import type { Project, Character } from '../types';

export interface AppState {
  projects: Project[];
  characters: Character[];
  activeProjectId: string | null;
  activeSceneId: string | null;
  lastSaved: string;
}

export interface ProjectHistory {
  id: string;
  timestamp: string;
  action: string;
  state: AppState;
}

const STORAGE_KEYS = {
  APP_STATE: 'storyart_app_state',
  HISTORY: 'storyart_history',
  SETTINGS: 'storyart_settings'
};

const MAX_HISTORY_ITEMS = 50;

// Auto-guardado local
export const saveAppState = (state: AppState): void => {
  try {
    const stateToSave = {
      ...state,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(stateToSave));
    console.log('✅ Estado guardado automáticamente');
  } catch (error) {
    console.error('❌ Error guardando estado:', error);
  }
};

export const loadAppState = (): AppState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    if (saved) {
      const state = JSON.parse(saved);
      console.log('✅ Estado cargado desde localStorage');
      return state;
    }
  } catch (error) {
    console.error('❌ Error cargando estado:', error);
  }
  return null;
};

// Historial de versiones (undo/redo)
export const saveToHistory = (state: AppState, action: string): void => {
  try {
    const historyItem: ProjectHistory = {
      id: `history_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      state: JSON.parse(JSON.stringify(state)) // Deep clone
    };

    const existingHistory = getHistory();
    const newHistory = [historyItem, ...existingHistory].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('❌ Error guardando en historial:', error);
  }
};

export const getHistory = (): ProjectHistory[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('❌ Error cargando historial:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

// Exportar/Importar proyectos
export const exportProject = (project: Project): void => {
  try {
    const exportData = {
      project,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    
    console.log('✅ Proyecto exportado:', project.name);
  } catch (error) {
    console.error('❌ Error exportando proyecto:', error);
  }
};

export const exportAllData = (state: AppState): void => {
  try {
    const exportData = {
      ...state,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `storyart_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Backup completo exportado');
  } catch (error) {
    console.error('❌ Error exportando backup:', error);
  }
};

export const importProject = (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.project && data.project.id && data.project.name) {
          // Generar nuevo ID para evitar conflictos
          const importedProject = {
            ...data.project,
            id: `proj_${Date.now()}`,
            name: `${data.project.name} (Importado)`
          };
          
          console.log('✅ Proyecto importado:', importedProject.name);
          resolve(importedProject);
        } else {
          throw new Error('Formato de archivo inválido');
        }
      } catch (error) {
        console.error('❌ Error importando proyecto:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error leyendo archivo'));
    reader.readAsText(file);
  });
};

// Backup automático
export const createAutoBackup = (state: AppState): void => {
  try {
    const backupKey = `${STORAGE_KEYS.APP_STATE}_backup_${Date.now()}`;
    const backups = getAutoBackups();
    
    // Mantener solo los últimos 5 backups
    if (backups.length >= 5) {
      const oldestBackup = backups[backups.length - 1];
      localStorage.removeItem(oldestBackup.key);
    }
    
    localStorage.setItem(backupKey, JSON.stringify({
      ...state,
      backupCreated: new Date().toISOString()
    }));
    
    // Actualizar lista de backups
    const newBackups = [
      { key: backupKey, timestamp: new Date().toISOString() },
      ...backups.slice(0, 4)
    ];
    
    localStorage.setItem('storyart_backups_list', JSON.stringify(newBackups));
    console.log('✅ Backup automático creado');
  } catch (error) {
    console.error('❌ Error creando backup automático:', error);
  }
};

export const getAutoBackups = (): Array<{ key: string; timestamp: string }> => {
  try {
    const saved = localStorage.getItem('storyart_backups_list');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

export const restoreFromBackup = (backupKey: string): AppState | null => {
  try {
    const backup = localStorage.getItem(backupKey);
    if (backup) {
      console.log('✅ Estado restaurado desde backup');
      return JSON.parse(backup);
    }
  } catch (error) {
    console.error('❌ Error restaurando backup:', error);
  }
  return null;
};