
import React, { useState, useEffect, useRef } from 'react';
import { Team, TournamentType, SavedTeam } from '../types';
import { TEAM_COLORS, TOTAL_TEAMS } from '../constants';

interface Props {
  onCancel: () => void;
  onStart: (name: string, type: TournamentType, teams: Team[]) => void;
}

const SetupForm: React.FC<Props> = ({ onCancel, onStart }) => {
  const [tournamentName, setTournamentName] = useState('Super League');
  const [type, setType] = useState<TournamentType>('league');
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
  
  const [teams, setTeams] = useState<Partial<Team>[]>(Array.from({ length: TOTAL_TEAMS }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: `Clube ${i + 1}`,
    playerName: `Treinador ${i + 1}`,
    color: TEAM_COLORS[i % TEAM_COLORS.length],
    stadium: { name: `Arena ${i + 1}`, primaryColor: TEAM_COLORS[i % TEAM_COLORS.length], capacity: 40000 + (i * 2000) }
  })));

  useEffect(() => {
    const saved = localStorage.getItem('manager_saved_teams_vault');
    if (saved) {
      try {
        setSavedTeams(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar times salvos");
      }
    }
  }, []);

  const handleLogoUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateTeam(id, 'logoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveTeamToVault = (team: Partial<Team>) => {
    const newSaved: SavedTeam = {
      id: team.id || Math.random().toString(36).substr(2, 9),
      name: team.name || 'Sem Nome',
      playerName: team.playerName || 'Sem Treinador',
      stadiumName: team.stadium?.name || 'Estádio',
      color: team.color || '#3b82f6',
      logoUrl: team.logoUrl
    };

    const updated = [newSaved, ...savedTeams.filter(t => t.name !== newSaved.name)].slice(0, 20);
    setSavedTeams(updated);
    localStorage.setItem('manager_saved_teams_vault', JSON.stringify(updated));
    alert(`${team.name} salvo para torneios futuros!`);
  };

  const loadSavedTeam = (targetId: string, saved: SavedTeam) => {
    setTeams(teams.map(t => {
      if (t.id === targetId) {
        return {
          ...t,
          name: saved.name,
          playerName: saved.playerName,
          color: saved.color,
          logoUrl: saved.logoUrl,
          stadium: { ...t.stadium!, name: saved.stadiumName, primaryColor: saved.color }
        };
      }
      return t;
    }));
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
    if (!tournamentName.trim()) return alert("Dê um nome ao torneio!");
    
    const finalTeams: Team[] = teams.map((t, i) => ({
      ...t,
      isHuman: true,
      color: t.color || TEAM_COLORS[i % TEAM_COLORS.length],
      players: [],
      budget: 10000000,
      sponsorship: 500000,
      salaries: 200000
    } as Team));
    
    onStart(tournamentName, type, finalTeams);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-800 p-8 rounded-[3rem] border border-slate-700 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10 pb-10 border-b border-slate-700/50">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] ml-2">Título da Competição</label>
            <input 
              value={tournamentName} 
              onChange={e => setTournamentName(e.target.value)} 
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-[2rem] px-8 py-5 text-3xl font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner" 
            />
          </div>
          <div className="flex bg-slate-900 p-2 rounded-[2rem] border-2 border-slate-700 shadow-lg">
            <button 
              onClick={() => setType('league')} 
              className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${type === 'league' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              📊 Pontos Corridos
            </button>
            <button 
              onClick={() => setType('cup')} 
              className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${type === 'cup' ? 'bg-amber-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              🏆 Mata-Mata
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <div key={team.id} className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-700 flex flex-col gap-5 group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="relative group/logo">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg overflow-hidden border-2 border-slate-700"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.logoUrl ? (
                      <img src={team.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                      team.name?.[0] || '?'
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <span className="text-[10px] font-bold text-white uppercase">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoUpload(team.id!, e.target.files[0])} />
                  </label>
                </div>
                <div className="flex-1">
                  <input 
                    placeholder="Nome do Clube" 
                    value={team.name} 
                    onChange={e => updateTeam(team.id!, 'name', e.target.value)} 
                    className="bg-transparent text-xl font-black text-white outline-none w-full border-b border-transparent focus:border-blue-500 mb-1"
                  />
                  <div className="flex gap-2">
                    <input type="color" value={team.color} onChange={e => updateTeam(team.id!, 'color', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                    <button onClick={() => saveTeamToVault(team)} className="text-[8px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Salvar Time</button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <label className="text-[8px] text-slate-500 font-black uppercase mb-1 block">Técnico Responsável</label>
                  <input value={team.playerName} onChange={e => updateTeam(team.id!, 'playerName', e.target.value)} className="bg-transparent text-white font-bold w-full outline-none text-sm" />
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <label className="text-[8px] text-slate-500 font-black uppercase mb-1 block">Estádio Principal</label>
                  <input value={team.stadium?.name} onChange={e => updateTeam(team.id!, 'stadium.name', e.target.value)} className="bg-transparent text-white font-bold w-full outline-none text-sm" />
                </div>
              </div>

              {savedTeams.length > 0 && (
                <div className="mt-2">
                  <select 
                    onChange={(e) => {
                      const saved = savedTeams.find(st => st.id === e.target.value);
                      if (saved) loadSavedTeam(team.id!, saved);
                    }}
                    className="w-full bg-slate-800 text-slate-400 text-[10px] font-bold p-2 rounded-lg border border-slate-700 outline-none"
                  >
                    <option value="">Carregar Time Salvo...</option>
                    {savedTeams.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button onClick={onCancel} className="flex-1 py-6 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-[2rem] uppercase tracking-widest transition-all text-sm">Voltar</button>
          <button onClick={handleStart} className="flex-[2] py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2rem] uppercase tracking-widest transition-all text-sm shadow-2xl shadow-blue-500/20">Iniciar Temporada</button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
