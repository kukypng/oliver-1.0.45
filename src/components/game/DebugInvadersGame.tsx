import React, { useCallback, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameStats } from './GameStats';
import { GameOver } from './GameOver';
import { Ranking } from './Ranking';
import { useDebugInvadersGame } from '@/hooks/useDebugInvadersGame';
import { useGameSounds } from '@/hooks/useGameSounds';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
export const DebugInvadersGame = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    playBugClick,
    playGameOver
  } = useGameSounds();
  const {
    gameState,
    score,
    level,
    lives,
    bugs,
    isGameOver,
    isPlaying,
    startGame,
    clickBug,
    restartGame
  } = useDebugInvadersGame();
  const handleBugClick = useCallback((bugId: string) => {
    clickBug(bugId);
    playBugClick();
  }, [clickBug, playBugClick]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  // Play game over sound
  useEffect(() => {
    if (isGameOver) {
      playGameOver();
    }
  }, [isGameOver, playGameOver]);

  // Se não está logado, mostrar mensagem de login necessário
  if (!user) {
    return <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-red-400/30 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Acesso Restrito</h2>
          <p className="text-green-400 mb-6">Você precisa estar logado para jogar!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors">
              Fazer Login
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors">
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <GameStats score={score} level={level} lives={lives} />
          
          <div className="relative">
            <GameBoard bugs={bugs} onBugClick={handleBugClick} isPlaying={isPlaying} />
            
            {!isPlaying && !isGameOver && <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <button onClick={startGame} className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xl transition-colors">Começar</button>
              </div>}

            {isGameOver && <GameOver score={score} onRestart={restartGame} />}
          </div>
        </div>

        {/* Ranking Sidebar */}
        <div className="lg:col-span-1">
          <Ranking />
        </div>
      </div>
    </div>;
};