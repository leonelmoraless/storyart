import React, { useMemo } from 'react';
import type { Project, Scene } from '../../types';

interface StoryFlowModalProps {
  project: Project;
  onClose: () => void;
  onNavigate: (sceneId: string) => void;
}

const StoryFlowModal: React.FC<StoryFlowModalProps> = ({ project, onClose, onNavigate }) => {
  const { nodes, edges } = useMemo(() => {
    if (!project) return { nodes: [], edges: [] };

    const nodeWidth = 180;
    const nodeHeight = 80;
    const horizontalGap = 80;
    const verticalGap = 60;

    const nodes = project.scenes.map((scene, index) => ({
      id: scene.id,
      name: scene.name,
      x: (index % 4) * (nodeWidth + horizontalGap) + 50,
      y: Math.floor(index / 4) * (nodeHeight + verticalGap) + 50,
      width: nodeWidth,
      height: nodeHeight,
    }));

    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    const edges = [];
    for (const scene of project.scenes) {
      for (const element of scene.elements) {
        if (element.nextSceneId) {
          const fromNode = nodeMap.get(scene.id);
          const toNode = nodeMap.get(element.nextSceneId);
          if (fromNode && toNode) {
            edges.push({
              id: `${fromNode.id}-${toNode.id}-${element.id}`,
              from: { x: fromNode.x + fromNode.width / 2, y: fromNode.y + fromNode.height },
              to: { x: toNode.x + toNode.width / 2, y: toNode.y },
            });
          }
        }
      }
    }
    return { nodes, edges };
  }, [project]);

  const viewBoxWidth = Math.max(800, ...nodes.map(n => n.x + n.width + 50));
  const viewBoxHeight = Math.max(600, ...nodes.map(n => n.y + n.height + 50));

  const getEdgePath = (from: {x:number, y:number}, to: {x:number, y:number}) => {
    const controlY1 = from.y + 50;
    const controlY2 = to.y - 50;
    return `M ${from.x},${from.y} C ${from.x},${controlY1} ${to.x},${controlY2} ${to.x},${to.y}`;
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-800 text-white rounded-xl shadow-2xl p-6 w-full h-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-700" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Flujo de la Historia: {project.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 bg-slate-900/50 rounded-lg overflow-auto border border-slate-700 relative">
          <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
              </marker>
            </defs>
            
            {/* Edges */}
            {edges.map(edge => (
               <path 
                    key={edge.id}
                    d={getEdgePath(edge.from, edge.to)}
                    stroke="#4f46e5" 
                    strokeWidth="2.5" 
                    fill="none" 
                    markerEnd="url(#arrow)"
                />
            ))}

            {/* Nodes */}
            <g>
              {nodes.map(node => (
                <foreignObject key={node.id} x={node.x} y={node.y} width={node.width} height={node.height}>
                   <div
                        className="w-full h-full bg-zinc-300 rounded-lg shadow-lg border-2 border-slate-400 p-2 flex items-center justify-center text-center cursor-pointer hover:border-violet-500 hover:scale-105 transition-all duration-200"
                        onClick={() => onNavigate(node.id)}
                    >
                       <p className="text-slate-800 font-semibold text-sm break-words">{node.name}</p>
                   </div>
                </foreignObject>
              ))}
            </g>
          </svg>
        </div>
         <p className="text-center text-gray-400 mt-3 text-sm">
            Haz clic en un nodo para navegar a esa escena.
        </p>
      </div>
    </div>
  );
};

export default StoryFlowModal;