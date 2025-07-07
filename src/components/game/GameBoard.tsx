import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug } from '@/hooks/useDebugInvadersGame';

interface GameBoardProps {
  bugs: Bug[];
  onBugClick: (bugId: string) => void;
  isPlaying: boolean;
}

const BugComponent: React.FC<{ bug: Bug; onClick: () => void }> = ({ bug, onClick }) => {
  const getBugEmoji = (type: Bug['type']) => {
    switch (type) {
      case 'critical-bug': return '🔥';
      case 'memory-leak': return '💀';
      default: return '🐞';
    }
  };

  const getBugColor = (type: Bug['type']) => {
    switch (type) {
      case 'critical-bug': return 'text-red-400';
      case 'memory-leak': return 'text-purple-400';
      default: return 'text-green-400';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`absolute text-2xl hover:scale-110 transition-transform cursor-pointer select-none ${getBugColor(bug.type)}`}
      style={{
        left: `${bug.x}%`,
        top: `${bug.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {getBugEmoji(bug.type)}
    </button>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({ bugs, onBugClick, isPlaying }) => {
  return (
    <div className="relative w-full h-96 bg-gray-900 border-2 border-green-400/30 rounded-lg overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="border border-green-400/20"></div>
          ))}
        </div>
      </div>

      {/* Bugs */}
      {bugs.map(bug => (
        <BugComponent
          key={bug.id}
          bug={bug}
          onClick={() => onBugClick(bug.id)}
        />
      ))}

      {/* Debug info */}
      {isPlaying && (
        <div className="absolute top-2 left-2 text-xs text-green-400/70">
          Processos ativos: {bugs.length}
        </div>
      )}

      {/* Game area indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/50"></div>
    </div>
  );
};