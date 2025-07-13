import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#0B1120] text-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-300 mb-8">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2 bg-slate-600 font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-300"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleConfirm} 
                        className="px-6 py-2 bg-red-600 font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
