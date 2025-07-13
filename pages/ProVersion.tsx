
import React from 'react';

const CheckmarkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center space-x-3">
        <div className="bg-slate-700 rounded-full p-1">
            <CheckmarkIcon />
        </div>
        <span className="text-slate-300">{children}</span>
    </li>
);

const ProVersion: React.FC = () => {
    return (
        <div className="text-white max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-4xl font-bold text-center mb-10">Planes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="bg-[#0B1120] border-2 border-slate-700 rounded-xl shadow-lg p-8 flex flex-col items-center">
                    <div className="bg-slate-700 rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M8.433 7.418c.155-.103.346-.155.546-.155.342 0 .65.133.883.377.233.244.35.559.35.917 0 .342-.128.646-.383.896-.255.25-.59.374-.98.374h-.32v1.438h-.904V7.418h.844zm.244 1.72h.224c.22 0 .403-.075.55-.224.146-.149.22-.342.22-.578 0-.236-.073-.426-.22-.57-.146-.144-.33-.216-.554-.216-.212 0-.39.07-.534.21-.145.14-.217.324-.217.55 0 .23.075.416.227.556.152.14.34.21.554.21z" />
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 100-18 9 9 0 000 18z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <ul className="space-y-4 my-8 text-lg">
                        <PlanFeature>Generación de personajes limitada</PlanFeature>
                        <PlanFeature>Hasta 3 proyectos</PlanFeature>
                        <PlanFeature>Exportación en baja resolución</PlanFeature>
                    </ul>
                    <button className="w-full mt-auto py-3 px-6 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors text-lg">
                        Permanecer en Plan Free
                    </button>
                </div>
                
                {/* Pro Plan */}
                <div className="bg-[#0B1120] rounded-xl shadow-lg p-8 flex flex-col items-center border-2 border-yellow-400">
                     <div className="bg-yellow-400 rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <ul className="space-y-4 my-8 text-lg">
                        <PlanFeature>Generaciones ilimitadas</PlanFeature>
                        <PlanFeature>Proyectos ilimitados</PlanFeature>
                        <PlanFeature>Estilos de arte exclusivos</PlanFeature>
                        <PlanFeature>Exportación en alta calidad (PDF, etc.)</PlanFeature>
                        <PlanFeature>Biblioteca de recursos compartidos</PlanFeature>
                    </ul>
                    <button className="w-full mt-auto py-3 px-6 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors text-lg">
                        Obtener Plan Pro 10$
                    </button>
                </div>
            </div>
            <p className="text-center text-gray-500 mt-8 text-sm">
                Los precios mostrados no incluyen impuestos aplicables. *Se aplican límites de uso.
            </p>
        </div>
    );
};

export default ProVersion;