
import React, { useState, useMemo } from 'react';
import { Team, Player } from '../types';
import { generateRandomPlayer } from '../constants';

interface Props {
  activeTeam: Team;
  allTeams: Team[];
  onBuy: (player: Player) => void;
  onSell: (playerId: string) => void;
}

const TransferMarket: React.FC<Props> = ({ activeTeam, allTeams, onBuy, onSell }) => {
  const [activePos, setActivePos] = useState<'GOL' | 'DEF' | 'MEI' | 'ATA'>('ATA');
  
  // Gerar alguns jogadores "Livres" no mercado que não pertencem a ninguém
  const freeAgents = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const pos: ('GOL' | 'DEF' | 'MEI' | 'ATA')[] = ['GOL', 'DEF', 'MEI', 'ATA'];
      return generateRandomPlayer(pos[i % 4]);
    });
  }, []);

  const formatMoney = (val: number) => `R$ ${(val / 1000000).toFixed(1)}M`;

  const getPosColor = (pos: string) => {
    switch(pos) {
      case 'GOL': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'DEF': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'MEI': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'ATA': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header do Time Ativo */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg" style={{ backgroundColor: activeTeam.color }}>
            {activeTeam.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{activeTeam.name}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Gerenciando Mercado</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Orçamento</p>
            <p className="text-xl font-black text-emerald-400">{formatMoney(activeTeam.budget)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Jogadores</p>
            <p className="text-xl font-black text-white">{activeTeam.players.length}/11</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Seu Plantel */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Seu Elenco</h3>
          <div className="space-y-2">
            {activeTeam.players.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 text-sm italic">
                Nenhum jogador contratado.
              </div>
            )}
            {activeTeam.players.sort((a,b) => b.rating - a.rating).map(player => (
              <div key={player.id} className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between group hover:border-slate-500 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${getPosColor(player.position)}`}>
                    {player.position}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{player.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">Rating: {player.rating}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSell(player.id)}
                  className="opacity-0 group-hover:opacity-100 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-all text-xs font-bold"
                >
                  VENDER
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Mercado Aberto */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-xl border border-slate-800">
            <div className="flex gap-1">
              {(['GOL', 'DEF', 'MEI', 'ATA'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => setActivePos(pos)}
                  className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                    activePos === pos 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeAgents.filter(p => p.position === activePos).map(player => (
              <div key={player.id} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl hover:border-blue-500/50 transition-all shadow-lg flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-blue-500/30">
                    <span className="text-xl font-black text-white">{player.rating}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-white group-hover:text-blue-400 transition-colors">{player.name}</h4>
                    <p className="text-xs font-bold text-emerald-400">{formatMoney(player.value)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onBuy(player)}
                  disabled={activeTeam.budget < player.value || activeTeam.players.length >= 11}
                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTeam.budget >= player.value && activeTeam.players.length < 11
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  CONTRATAR
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] pt-4">
            — Novos atletas em observação —
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferMarket;
