
import React, { useState } from 'react';
import { Team } from '../types';
import { DEFAULT_BOT_NAMES, TEAM_COLORS, TOTAL_TEAMS } from '../constants';

interface Props {
  onStart: (teams: Team[]) => void;
}

const SetupForm: React.FC<Props> = ({ onStart }) => {
  const [numHumans, setNumHumans] = useState(1);
  const [globalBudget, setGlobalBudget] = useState(1000000);
  const [humanInputs, setHumanInputs] = useState(
    Array.from({ length: TOTAL_TEAMS }, (_, i) => ({
      playerName: `Jogador ${i + 1}`,
      teamName: `Time ${i + 1}`,
      stadiumName: `Arena ${i + 1}`,
      capacity: 40000,
      customBudget: 1000000
    }))
  );

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const newInputs = [...humanInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setHumanInputs(newInputs);
  };

  const handleStart = () => {
    const finalTeams: Team[] = [];
    const availableBots = [...DEFAULT_BOT_NAMES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < TOTAL_TEAMS; i++) {
      if (i < numHumans) {
        // Fix: Add missing sponsorship and salaries properties to match Team interface
        finalTeams.push({
          id: `team-${i}`,
          name: humanInputs[i].teamName,
          playerName: humanInputs[i].playerName,
          isHuman: true,
          color: TEAM_COLORS[i % TEAM_COLORS.length],
          stadium: {
            name: humanInputs[i].stadiumName,
            primaryColor: TEAM_COLORS[i % TEAM_COLORS.length],
            capacity: humanInputs[i].capacity
          },
          initialBudget: humanInputs[i].customBudget || globalBudget,
          budget: humanInputs[i].customBudget || globalBudget,
          sponsorship: 500000,
          salaries: 300000,
          players: []
        });
      } else {
        const botColor = TEAM_COLORS[(i + 3) % TEAM_COLORS.length];
        // Fix: Add missing sponsorship and salaries properties to match Team interface
        finalTeams.push({
          id: `team-${i}`,
          name: availableBots[i - numHumans] || `AI Team ${i}`,
          playerName: 'Computador',
          isHuman: false,
          color: botColor,
          stadium: {
            name: `Estádio Municipal de ${availableBots[i - numHumans]}`,
            primaryColor: botColor,
            capacity: 35000 + Math.floor(Math.random() * 20000)
          },
          initialBudget: globalBudget,
          budget: globalBudget,
          sponsorship: 500000,
          salaries: 300000,
          players: []
        });
      }
    }
    onStart(finalTeams);
  };

  return (
    <div className="max-w-5xl mx-auto bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">BRASILEIRÃO MANAGER</h2>
        <p className="text-slate-400 font-medium italic">Personalize seu clube, estádio e finanças para a glória</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-inner">
          <label className="block text-slate-400 text-xs font-black mb-4 text-center uppercase tracking-[0.2em]">Quantidade de Jogadores</label>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => setNumHumans(num)}
                className={`py-3 rounded-xl font-black border-2 transition-all ${
                  numHumans === num 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20 scale-105' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-inner">
          <label className="block text-slate-400 text-xs font-black mb-2 text-center uppercase tracking-[0.2em]">Orçamento Base da Liga</label>
          <input 
            type="number"
            value={globalBudget}
            onChange={(e) => setGlobalBudget(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-black text-2xl text-center focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <p className="text-[10px] text-slate-500 text-center mt-2 uppercase font-bold tracking-wider">Valor inicial padrão para todos os times</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-1">
        {Array.from({ length: numHumans }).map((_, i) => (
          <div key={i} className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-5 group hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-blue-400 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Treinador {i+1}
              </h3>
              <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-1 rounded">PLAYER</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase">Seu Nome</label>
                <input
                  value={humanInputs[i].playerName}
                  onChange={(e) => handleInputChange(i, 'playerName', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Tite"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase">Nome do Clube</label>
                <input
                  value={humanInputs[i].teamName}
                  onChange={(e) => handleInputChange(i, 'teamName', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Real Madrid"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-1">
                  🏟️ Estádio
                </label>
                <input
                  value={humanInputs[i].stadiumName}
                  onChange={(e) => handleInputChange(i, 'stadiumName', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Ex: Maracanã"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-black uppercase">Capacidade</label>
                <input
                  type="number"
                  value={humanInputs[i].capacity}
                  onChange={(e) => handleInputChange(i, 'capacity', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-slate-500 text-[10px] font-black uppercase mb-1">Orçamento Exclusivo (R$)</label>
              <input
                type="number"
                value={humanInputs[i].customBudget}
                onChange={(e) => handleInputChange(i, 'customBudget', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-sm font-black focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        ))}
        {Array.from({ length: TOTAL_TEAMS - numHumans }).map((_, i) => (
          <div key={`ai-${i}`} className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50 flex flex-col justify-center items-center opacity-40 grayscale">
             <div className="text-2xl mb-2">🤖</div>
             <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Adversário IA</h3>
             <p className="text-[9px] text-slate-600 font-bold">Configuração Automática</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-[0.3em] active:scale-95 text-lg"
      >
        Lançar Campeonato
      </button>
    </div>
  );
};

export default SetupForm;
