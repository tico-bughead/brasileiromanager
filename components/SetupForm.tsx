
import React, { useState } from 'react';
import { Team, TournamentType } from '../types';
import { TEAM_COLORS, TOTAL_TEAMS } from '../constants';

interface Props {
  onCancel: () => void;
  onStart: (name: string, type: TournamentType, teams: Team[]) => void;
}

const SetupForm: React.FC<Props> = ({ onCancel, onStart }) => {
  const [tournamentName, setTournamentName] = useState('Campeonato Brasileiro');
  const [type, setType] = useState<TournamentType>('league');
  
  const [teams, setTeams] = useState<Partial<Team>[]>(Array.from({ length: TOTAL_TEAMS }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: `Clube ${i + 1}`,
    playerName: `Treinador ${i + 1}`,
    stadium: { name: `Arena ${i + 1}`, primaryColor: TEAM_COLORS[i % TEAM_COLORS.length], capacity: 40000 + (i * 2000) }
  })));

  const addTeam = () => {
    if (teams.length >= 20) return;
    const nextIdx = teams.length;
    const color = TEAM_COLORS[nextIdx % TEAM_COLORS.length];
    setTeams([...teams, {
      id: Math.random().toString(36).substr(2, 9),
      name: `Clube ${nextIdx + 1}`,
      playerName: `Treinador ${nextIdx + 1}`,
      stadium: { name: `Estádio ${nextIdx + 1}`, primaryColor: color, capacity: 35000 }
    }]);
  };

  const removeTeam = (id: string) => {
    if (teams.length <= 2) return;
    setTeams(teams.filter(t => t.id !== id));
  };

  const updateTeam = (id: string, field: string, value: any) => {
    setTeams(teams.map(t => {
      if (t.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { ...t, [parent]: { ...(t as any)[parent], [child]: value } };
        }
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleStart = () => {
    if (!tournamentName.trim()) {
      alert("Por favor, insira o nome do torneio.");
      return;
    }
    
    const finalTeams: Team[] = teams.map((t, i) => ({
      ...t,
      isHuman: true,
      color: TEAM_COLORS[i % TEAM_COLORS.length],
      players: [],
      budget: 10000000,
      sponsorship: 500000,
      salaries: 200000
    } as Team));
    
    onStart(tournamentName, type, finalTeams);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-8 border-b border-slate-700">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-black text-blue-500 uppercase tracking-widest">Nome do Torneio</label>
            <input value={tournamentName} onChange={e => setTournamentName(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-6 py-4 text-2xl font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="Ex: Brasileirão, Libertadores..." />
          </div>
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-700">
            <button onClick={() => setType('league')} className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${type === 'league' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>📊 Liga</button>
            <button onClick={() => setType('cup')} className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${type === 'cup' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>🏆 Copa</button>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
           <h3 className="text-white font-black uppercase tracking-widest text-sm">Personalização dos Clubes ({teams.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-8">
          {teams.map((team) => (
            <div key={team.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 group hover:border-blue-500/30 transition-all flex gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase">Clube</label>
                    <input value={team.name} onChange={e => updateTeam(team.id!, 'name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-bold focus:border-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase">Treinador</label>
                    <input value={team.playerName} onChange={e => updateTeam(team.id!, 'playerName', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-black uppercase">Estádio</label>
                  <input value={team.stadium?.name} onChange={e => updateTeam(team.id!, 'stadium.name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
              <button onClick={() => removeTeam(team.id!)} className="self-start p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Remover Time">✕</button>
            </div>
          ))}
          <button onClick={addTeam} className="h-full min-h-[140px] border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all bg-slate-900/20 py-8">
            <span className="text-3xl font-light">+</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Clube</span>
          </button>
        </div>

        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-5 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-2xl uppercase tracking-widest transition-all">Cancelar</button>
          <button onClick={handleStart} className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20">Começar Torneio</button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
