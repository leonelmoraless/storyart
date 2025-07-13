import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = ''
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      
      <button
        onClick={onAction}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {actionText}
      </button>
      
      <div className="mt-6 p-4 bg-slate-800 rounded-lg max-w-md">
        <p className="text-sm text-gray-300">
          💡 <strong>Tip:</strong> Usa la IA para generar contenido automáticamente y acelerar tu proceso creativo.
        </p>
      </div>
    </div>
  );
};

// Componentes específicos para diferentes estados vacíos
export const EmptyProjects: React.FC<{ onCreateProject: () => void }> = ({ onCreateProject }) => (
  <EmptyState
    title="No tienes proyectos aún"
    description="Crea tu primer proyecto para comenzar a construir historias increíbles con IA."
    actionText="Crear Primer Proyecto"
    onAction={onCreateProject}
    icon={
      <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    }
  />
);

export const EmptyCharacters: React.FC<{ onCreateCharacter: () => void }> = ({ onCreateCharacter }) => (
  <EmptyState
    title="No tienes personajes creados"
    description="Genera personajes únicos con IA para dar vida a tus historias."
    actionText="Generar Primer Personaje"
    onAction={onCreateCharacter}
    icon={
      <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    }
  />
);

export const EmptyScenes: React.FC<{ onCreateScene: () => void }> = ({ onCreateScene }) => (
  <EmptyState
    title="No hay escenas en este proyecto"
    description="Crea tu primera escena para comenzar a construir tu historia."
    actionText="Generar Primera Escena"
    onAction={onCreateScene}
    icon={
      <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    }
  />
);

export default EmptyState;