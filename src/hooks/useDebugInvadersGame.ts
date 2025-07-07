import { useState, useEffect, useCallback, useRef } from 'react';

export interface Bug {
  id: string;
  x: number;
  y: number;
  speed: number;
  type: 'bug' | 'critical-bug' | 'memory-leak';
}

export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

export const useDebugInvadersGame = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [bugs, setBugs] = useState<Bug[]>([]);
  
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const spawnTimerRef = useRef<NodeJS.Timeout>();
  const lastSpawnRef = useRef(0);

  const isPlaying = gameState === 'playing';
  const isGameOver = gameState === 'gameOver';

  // Generate random bug
  const createBug = useCallback((): Bug => {
    const bugTypes: Bug['type'][] = ['bug', 'critical-bug', 'memory-leak'];
    const type = bugTypes[Math.floor(Math.random() * bugTypes.length)];
    
    return {
      id: `bug-${Date.now()}-${Math.random()}`,
      x: Math.random() * 90, // 0-90% to avoid edges
      y: -5,
      speed: 0.3 + (level * 0.1) + Math.random() * 0.3,
      type
    };
  }, [level]);

  // Spawn bugs
  const spawnBug = useCallback(() => {
    if (!isPlaying) return;
    
    const now = Date.now();
    const spawnRate = Math.max(1200 - (level * 80), 500); // Mais tempo entre spawns
    
    if (now - lastSpawnRef.current > spawnRate) {
      setBugs(prev => [...prev, createBug()]);
      lastSpawnRef.current = now;
    }
  }, [isPlaying, level, createBug]);

  // Move bugs down
  const updateBugs = useCallback(() => {
    if (!isPlaying) return;

    setBugs(prev => {
      const updatedBugs = prev.map(bug => ({ ...bug, y: bug.y + bug.speed }));
      
      // Count bugs that just passed the bottom line (y >= 100)
      const bugsPassedCount = updatedBugs.filter(bug => 
        bug.y >= 100 && (bug.y - bug.speed) < 100
      ).length;
      
      // Remove life for each bug that passed
      if (bugsPassedCount > 0) {
        setLives(current => {
          const newLives = current - bugsPassedCount;
          if (newLives <= 0) {
            setGameState('gameOver');
          }
          return newLives;
        });
      }

      // Remove bugs that passed the bottom
      return updatedBugs.filter(bug => bug.y < 100);
    });
  }, [isPlaying]);

  // Game loop
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(() => {
        updateBugs();
        spawnBug();
      }, 50); // 20 FPS

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [isPlaying, updateBugs, spawnBug]);

  // Level progression - mais lento
  useEffect(() => {
    const newLevel = Math.floor(score / 150) + 1; // Precisa de mais pontos para subir de nível
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  // Click bug handler
  const clickBug = useCallback((bugId: string) => {
    if (!isPlaying) return;

    setBugs(prev => {
      const clickedBug = prev.find(bug => bug.id === bugId);
      if (!clickedBug) return prev;

      // Score based on bug type
      let points = 10;
      switch (clickedBug.type) {
        case 'critical-bug':
          points = 25;
          break;
        case 'memory-leak':
          points = 50;
          break;
      }

      setScore(current => current + points);
      return prev.filter(bug => bug.id !== bugId);
    });
  }, [isPlaying]);

  // Game controls
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(5);
    setBugs([]);
    lastSpawnRef.current = Date.now();
  }, []);

  const restartGame = useCallback(() => {
    setGameState('idle');
    setTimeout(startGame, 100);
  }, [startGame]);

  const pauseGame = useCallback(() => {
    if (isPlaying) {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [isPlaying, gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    score,
    level,
    lives,
    bugs,
    isPlaying,
    isGameOver,
    startGame,
    restartGame,
    pauseGame,
    clickBug
  };
};