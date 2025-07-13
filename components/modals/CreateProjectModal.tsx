import React, { useState } from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setError('El nombre del proyecto es requerido');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('El nombre no puede exceder 50 caracteres');
      return;
    }

    onCreateProject(trimmedName);
    setProjectName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setProjectName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Crear Nuevo Proyecto</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setError('');
              }}
              placeholder="Ej: Mi Primera Historia"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              maxLength={50}
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {projectName.length}/50 caracteres
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!projectName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Crear Proyecto
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-slate-700 rounded-md">
          <p className="text-sm text-gray-300">
            💡 <strong>Tip:</strong> Elige un nombre descriptivo para tu historia. 
            Podrás cambiarlo más tarde desde la configuración del proyecto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;