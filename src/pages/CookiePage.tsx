import React from 'react';
import { DebugInvadersGame } from '@/components/game/DebugInvadersGame';
import { useAuth } from '@/hooks/useAuth';
export const CookiePage = () => {
  const {
    profile
  } = useAuth();
  return <div className="min-h-screen bg-black text-green-400 font-mono relative">
      {/* Terminal Header */}
      <div className="border-b border-green-400/30 p-4 py-[29px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          
          
          <span className="ml-4 text-sm">terminal@kuky.png</span>
        </div>
      </div>

      {/* User Badge - Hacker Style */}
      {profile && <div className="fixed top-4 right-4 z-10">
          <div className="bg-gray-900/80 border border-green-400/50 rounded-md backdrop-blur-sm my-0 px-[17px] py-[9px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-mono">
                root@{profile.name.toLowerCase().replace(/\s+/g, '_')}
              </span>
            </div>
            <div className="text-[10px] text-green-400/70 mt-1">
              Access_Level: {profile.role.toUpperCase()}
            </div>
          </div>
        </div>}

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2 animate-pulse">Caçador de Bugs</div>
          <div className="text-sm opacity-70">
            Clique nos bugs antes que eles quebrem seu sistema!
          </div>
        </div>

        <DebugInvadersGame />
      </div>

      {/* Footer com botão de voltar */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-green-400/50 rounded-md backdrop-blur-sm hover:bg-green-900/20 transition-colors group"
        >
          <span className="text-green-400 text-sm">←</span>
          <span className="text-green-400 text-xs group-hover:text-white transition-colors">
            Voltar ao Site
          </span>
        </button>
      </div>
    </div>;
};