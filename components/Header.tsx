import React, { useState } from 'react';

interface HeaderProps {
    onSave: () => void;
    onShowFlow: () => void;
    onExportPDF?: () => void;
    onPreviewScene?: () => void;
    isFlowVisible: boolean;
    hasScenes?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSave, onShowFlow, onExportPDF, onPreviewScene, isFlowVisible, hasScenes = false }) => {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'exported'>('idle');

    const handleSaveClick = () => {
        setSaveStatus('saving');
        onSave();
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const handleExportClick = async () => {
        if (!onExportPDF || !hasScenes) return;
        
        setExportStatus('exporting');
        try {
            await onExportPDF();
            setExportStatus('exported');
            setTimeout(() => setExportStatus('idle'), 3000);
        } catch (error) {
            console.error('Error exportando PDF:', error);
            setExportStatus('idle');
        }
    };

    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 flex-shrink-0">
             <div>
                <button 
                    onClick={onShowFlow} 
                    disabled={!isFlowVisible}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    title={isFlowVisible ? "Mostrar el flujo de la historia" : "Añade más de una escena para ver el flujo"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                    </svg>
                    Ver Flujo
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={handleSaveClick}
                    className="px-4 py-2 w-36 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300"
                    disabled={saveStatus !== 'idle'}
                >
                    {saveStatus === 'idle' && 'Guardar proyecto'}
                    {saveStatus === 'saving' && (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Guardando...
                        </div>
                    )}
                    {saveStatus === 'saved' && (
                         <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            ¡Guardado!
                        </div>
                    )}
                </button>
                <button 
                    onClick={handleExportClick}
                    disabled={!hasScenes || exportStatus !== 'idle'}
                    className="px-4 py-2 w-40 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={hasScenes ? "Exportar historia como PDF" : "Necesitas al menos una escena para exportar"}
                >
                    {exportStatus === 'idle' && (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Exportar PDF
                        </div>
                    )}
                    {exportStatus === 'exporting' && (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Exportando...
                        </div>
                    )}
                    {exportStatus === 'exported' && (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            ¡Exportado!
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;