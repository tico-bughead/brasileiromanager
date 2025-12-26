
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Team, Match, StandingRow, AppState, ActiveTab, Championship, TournamentType } from './types';
import Home from './components/Home';
import SetupForm from './components/SetupForm';
import LeagueTable from './components/LeagueTable';
import MatchList from './components/MatchList';
import ChampionModal from './components/ChampionModal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [activeChampId, setActiveChampId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [showChampionModal, setShowChampionModal] = useState(false);
  
  const isFirstRender = useRef(true);

  // Carregamento inicial do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('manager_pro_championships');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChampionships(parsed);
        }
      } catch (e) {
        console.error("Erro ao carregar campeonatos", e);
      }
    }
  }, []);

  // Salvamento automático ao mudar campeonatos
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('manager_pro_championships', JSON.stringify(championships));
  }, [championships]);

  const activeChamp = useMemo(() => 
    championships.find(c => c.id === activeChampId), 
    [championships, activeChampId]
  );

  const generateLeagueSchedule = (teamList: Team[]) => {
    const n = teamList.length;
    const teamIds = teamList.map(t => t.id);
    
    const tempIds = [...teamIds];
    if (n % 2 !== 0) tempIds.push('BYE');
    const numTeams = tempIds.length;
    const numRounds = numTeams - 1;

    const firstLeg: Match[] = [];
    for (let r = 0; r < numRounds; r++) {
      for (let i = 0; i < numTeams / 2; i++) {
        const home = tempIds[i];
        const away = tempIds[numTeams - 1 - i];
        if (home !== 'BYE' && away !== 'BYE') {
          firstLeg.push({
            id: `m-${r}-${i}`,
            homeId: home as string,
            awayId: away as string,
            homeScore: null,
            awayScore: null,
            round: r + 1
          });
        }
      }
      tempIds.splice(1, 0, tempIds.pop()!);
    }

    const secondLeg = firstLeg.map(m => ({
      ...m,
      id: `m-ret-${m.id}`,
      homeId: m.awayId,
      awayId: m.homeId,
      round: m.round + numRounds
    }));

    return [...firstLeg, ...secondLeg];
  };

  const generateCupSchedule = (teamList: Team[]) => {
    const matches: Match[] = [];
    const n = teamList.length;
    for (let i = 0; i < n; i += 2) {
      if (i + 1 < n) {
        matches.push({
          id: `cup-m1-${i}`,
          homeId: teamList[i].id,
          awayId: teamList[i+1].id,
          homeScore: null,
          awayScore: null,
          round: 1,
          stage: 'Quartas de Final'
        });
      }
    }
    return matches;
  };

  const handleStartTournament = (name: string, type: TournamentType, teams: Team[]) => {
    const newChamp: Championship = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      teams,
      matches: type === 'league' ? generateLeagueSchedule(teams) : generateCupSchedule(teams),
      status: 'active',
      createdAt: Date.now()
    };
    setChampionships([newChamp, ...championships]);
    setActiveChampId(newChamp.id);
    setAppState('active_tournament');
    setActiveTab(type === 'league' ? 'table' : 'matches');
  };

  const updateScore = (matchId: string, homeScore: number, awayScore: number) => {
    setChampionships(prev => prev.map(c => {
      if (c.id === activeChampId) {
        return {
          ...c,
          matches: c.matches.map(m => m.id === matchId ? { ...m, homeScore, awayScore } : m)
        };
      }
      return c;
    }));
  };

  const deleteChampionship = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Deseja realmente excluir este campeonato?")) {
      setChampionships(prev => prev.filter(c => c.id !== id));
      if (activeChampId === id) {
        setAppState('dashboard');
        setActiveChampId(null);
      }
    }
  };

  const standings = useMemo(() => {
    if (!activeChamp || activeChamp.type !== 'league') return [];
    
    const stats: Record<string, StandingRow> = {};
    activeChamp.teams.forEach(t => {
      stats[t.id] = {
        teamId: t.id, teamName: t.name, isHuman: t.isHuman,
        played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, lastFive: []
      };
    });

    const resultsByTeam: Record<string, ('W' | 'D' | 'L')[]> = {};
    activeChamp.teams.forEach(t => resultsByTeam[t.id] = []);

    activeChamp.matches.forEach(m => {
      if (m.homeScore !== null && m.awayScore !== null) {
        const h = stats[m.homeId];
        const a = stats[m.awayId];
        if (!h || !a) return;
        h.played++; a.played++;
        h.gf += m.homeScore; h.ga += m.awayScore;
        a.gf += m.awayScore; a.ga += m.homeScore;
        if (m.homeScore > m.awayScore) {
          h.won++; h.points += 3; a.lost++;
          resultsByTeam[m.homeId].push('W'); resultsByTeam[m.awayId].push('L');
        } else if (m.homeScore < m.awayScore) {
          a.won++; a.points += 3; h.lost++;
          resultsByTeam[m.homeId].push('L'); resultsByTeam[m.awayId].push('W');
        } else {
          h.drawn++; a.drawn++; h.points += 1; a.points += 1;
          resultsByTeam[m.homeId].push('D'); resultsByTeam[m.awayId].push('D');
        }
        h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
      }
    });

    return Object.values(stats)
      .map(s => ({ ...s, lastFive: resultsByTeam[s.teamId]?.slice(-5).reverse() || [] }))
      .sort((a, b) => b.points - a.points || b.won - a.won || b.gd - a.gd || b.gf - a.gf);
  }, [activeChamp]);

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter hidden sm:block uppercase">Brasileirão Manager</h1>
          </div>
          
          {appState === 'active_tournament' && activeChamp && (
            <nav className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 overflow-x-auto gap-1">
              {activeChamp.type === 'league' && (
                <button onClick={() => setActiveTab('table')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'table' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}>Tabela</button>
              )}
              <button onClick={() => setActiveTab('matches')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'matches' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}>Jogos</button>
              <button onClick={() => setActiveTab('stadiums')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'stadiums' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}>Estádios</button>
            </nav>
          )}

          <div className="flex gap-2">
            {appState !== 'dashboard' && (
              <button 
                onClick={() => setAppState('dashboard')}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700"
              >
                Painel
              </button>
            )}
            <button 
              onClick={() => setAppState('create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              + Novo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {appState === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Central de Comando</div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Seus <span className="text-blue-500">Campeonatos</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Gerencie múltiplas ligas e copas. Cada torneio é único.</p>
            </div>

            {championships.length === 0 ? (
              <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-[3rem] p-20 text-center space-y-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center text-4xl mb-2 opacity-50">⚽</div>
                <div className="space-y-2">
                  <p className="text-white font-bold text-2xl uppercase tracking-tighter">Campo Vazio</p>
                  <p className="text-slate-500 font-medium italic">Nenhum torneio ativo no momento.</p>
                </div>
                <button 
                  onClick={() => setAppState('create')} 
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  Criar Primeiro Torneio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {championships.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => { setActiveChampId(c.id); setAppState('active_tournament'); setActiveTab(c.type === 'league' ? 'table' : 'matches'); }}
                    className="bg-slate-800/80 border border-slate-700 p-8 rounded-[2.5rem] shadow-xl hover:border-blue-500/40 transition-all group relative overflow-hidden cursor-pointer flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.type === 'league' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {c.type === 'league' ? 'Liga (Pontos)' : 'Copa (Mata-Mata)'}
                        </span>
                        <button 
                          onClick={(e) => deleteChampionship(e, c.id)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/50 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all z-20"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter truncate group-hover:text-blue-400 transition-colors">{c.name}</h3>
                      <div className="flex items-center gap-2 mb-8">
                        <div className="flex -space-x-2">
                          {c.teams.slice(0, 3).map(t => (
                            <div key={t.id} className="w-6 h-6 rounded-full border-2 border-slate-800 shadow-sm" style={{ backgroundColor: t.color }}></div>
                          ))}
                          {c.teams.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-[8px] font-black text-white">
                              +{c.teams.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{c.teams.length} TIMES PARTICIPANTES</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Iniciado em {new Date(c.createdAt).toLocaleDateString()}</span>
                        <span className="text-blue-500 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">Gerenciar →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {appState === 'create' && (
          <SetupForm onCancel={() => setAppState('dashboard')} onStart={handleStartTournament} />
        )}

        {appState === 'active_tournament' && activeChamp && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeChamp.type === 'league' ? 'bg-blue-500' : 'bg-amber-500'} animate-pulse`}></span>
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">{activeChamp.type === 'league' ? 'Campeonato em Formato de Liga' : 'Campeonato em Formato de Copa'}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">{activeChamp.name}</h2>
              </div>
            </div>

            {activeTab === 'table' && activeChamp.type === 'league' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <LeagueTable standings={standings} />
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <MatchList 
                  matches={activeChamp.matches} 
                  teams={activeChamp.teams} 
                  onUpdateScore={updateScore} 
                  onShowResults={() => setShowChampionModal(true)}
                />
              </div>
            )}

            {activeTab === 'stadiums' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {activeChamp.teams.map(team => (
                  <div key={team.id} className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-xl hover:border-blue-500/30 transition-all group">
                    <div className="h-32 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `linear-gradient(45deg, ${team.color} 25%, transparent 25%, transparent 50%, ${team.color} 50%, ${team.color} 75%, transparent 75%, transparent)` , backgroundSize: '40px 40px'}}></div>
                       <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-2xl relative z-10 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ backgroundColor: team.color }}>
                         {team.name[0]}
                       </div>
                    </div>
                    <div className="p-8">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Sede do {team.name}</p>
                      <h4 className="text-white font-black text-2xl mb-6 tracking-tight">{team.stadium.name}</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                          <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Capacidade</p>
                          <p className="text-lg font-black text-white">{team.stadium.capacity.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                          <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Treinador</p>
                          <p className="text-lg font-black text-blue-400 truncate" title={team.playerName}>{team.playerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showChampionModal && activeChamp && activeChamp.type === 'league' && (
        <ChampionModal 
          champion={standings[0]} 
          teamDetails={activeChamp.teams.find(t => t.id === standings[0].teamId)} 
          onClose={() => setShowChampionModal(false)} 
        />
      )}
    </div>
  );
};

export default App;
