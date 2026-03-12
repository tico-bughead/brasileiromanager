
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Team, Match, StandingRow, AppState, ActiveTab, Championship, TournamentType } from './types';
import SetupForm from './components/SetupForm';
import LeagueTable from './components/LeagueTable';
import MatchList from './components/MatchList';
import ChampionModal from './components/ChampionModal';
import Home from './components/Home';
import { syncChampionshipToCloud, fetchChampionshipsFromCloud, deleteChampionshipFromCloud } from './services/supabase';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [activeChampId, setActiveChampId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [showChampionModal, setShowChampionModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  
  const isFirstRender = useRef(true);

  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('manager_pro_v3_champs');
      if (saved) {
        try { setChampionships(JSON.parse(saved)); } catch (e) { console.error(e); }
      }
      const cloudData = await fetchChampionshipsFromCloud();
      if (cloudData && cloudData.length > 0) {
        const formattedCloud: Championship[] = cloudData.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type as TournamentType,
          teams: item.teams,
          matches: item.matches,
          status: item.status as 'active' | 'finished',
          currentStage: (item.currentStage || 'group') as any,
          createdAt: new Date(item.created_at || Date.now()).getTime(),
          teamGroups: item.teamGroups
        }));
        setChampionships(formattedCloud);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('manager_pro_v3_champs', JSON.stringify(championships));
    if (championships.length > 0 && activeChampId) {
      const active = championships.find(c => c.id === activeChampId);
      if (active) {
        setSyncStatus('syncing');
        syncChampionshipToCloud(active).then(success => {
          setSyncStatus(success ? 'success' : 'error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        });
      }
    }
  }, [championships, activeChampId]);

  const activeChamp = useMemo(() => championships.find(c => c.id === activeChampId), [championships, activeChampId]);

  const generateLeagueSchedule = (teamList: Team[]) => {
    const tempIds = teamList.map(t => t.id);
    const numTeams = tempIds.length;
    const numRoundsPerLeg = numTeams - 1;
    const firstLeg: Match[] = [];
    const rotation = [...tempIds];

    for (let r = 0; r < numRoundsPerLeg; r++) {
      for (let i = 0; i < numTeams / 2; i++) {
        const home = rotation[i];
        const away = rotation[numTeams - 1 - i];
        firstLeg.push({ id: `l1-${r}-${i}`, homeId: home, awayId: away, homeScore: null, awayScore: null, round: r + 1, stage: 'Fase de Grupos' });
      }
      rotation.splice(1, 0, rotation.pop()!);
    }
    const secondLeg = firstLeg.map(m => ({
      ...m, id: `l2-${m.id}`, homeId: m.awayId, awayId: m.homeId, round: m.round + numRoundsPerLeg
    }));
    return [...firstLeg, ...secondLeg];
  };

  const generateCupStructure = (teamList: Team[]) => {
    const numTeams = teamList.length;
    const teamGroups: Record<string, string[]> = {};
    const matches: Match[] = [];

    // Para 6 times, criamos 2 grupos de 3 (A e B)
    if (numTeams === 6) {
      const shuffled = [...teamList].sort(() => Math.random() - 0.5);
      teamGroups['A'] = shuffled.slice(0, 3).map(t => t.id);
      teamGroups['B'] = shuffled.slice(3, 6).map(t => t.id);

      // Gerar partidas para cada grupo (Todos contra todos em turno único)
      ['A', 'B'].forEach(gid => {
        const gTeams = teamGroups[gid];
        // R1: 1 x 2
        matches.push({ id: `g-${gid}-r1`, homeId: gTeams[0], awayId: gTeams[1], homeScore: null, awayScore: null, round: 1, stage: 'Fase de Grupos', groupId: gid });
        // R2: 2 x 3
        matches.push({ id: `g-${gid}-r2`, homeId: gTeams[1], awayId: gTeams[2], homeScore: null, awayScore: null, round: 2, stage: 'Fase de Grupos', groupId: gid });
        // R3: 3 x 1
        matches.push({ id: `g-${gid}-r3`, homeId: gTeams[2], awayId: gTeams[0], homeScore: null, awayScore: null, round: 3, stage: 'Fase de Grupos', groupId: gid });
      });
    } else {
      // Fallback para grupo único se for < 6
      teamGroups['A'] = teamList.map(t => t.id);
      const rotation = [...teamGroups['A']];
      for (let r = 0; r < numTeams - 1; r++) {
        for (let i = 0; i < numTeams / 2; i++) {
          matches.push({ id: `g-A-r${r}-m${i}`, homeId: rotation[i], awayId: rotation[numTeams - 1 - i], homeScore: null, awayScore: null, round: r + 1, stage: 'Fase de Grupos', groupId: 'A' });
        }
        rotation.splice(1, 0, rotation.pop()!);
      }
    }
    return { teamGroups, matches };
  };

  const handleStartTournament = (name: string, type: TournamentType, teams: Team[]) => {
    let matches: Match[] = [];
    let teamGroups: Record<string, string[]> | undefined = undefined;

    if (type === 'league') {
      matches = generateLeagueSchedule(teams);
    } else {
      const cupData = generateCupStructure(teams);
      matches = cupData.matches;
      teamGroups = cupData.teamGroups;
    }

    const newChamp: Championship = {
      id: Math.random().toString(36).substr(2, 9),
      name, type, teams,
      matches,
      status: 'active',
      currentStage: 'group',
      createdAt: Date.now(),
      teamGroups
    };
    setChampionships([newChamp, ...championships]);
    setActiveChampId(newChamp.id);
    setAppState('active_tournament');
    setActiveTab('table');
  };

  // Fixed potential 'unknown' type error in Object.entries iteration
  const standingsByGroup = useMemo((): Record<string, StandingRow[]> => {
    if (!activeChamp) return {};
    const groups: Record<string, string[]> = activeChamp.teamGroups || { 'A': activeChamp.teams.map(t => t.id) };
    const results: Record<string, StandingRow[]> = {};

    Object.entries(groups).forEach(([groupId, teamIds]) => {
      // Cast teamIds to string[] to avoid TS error
      const ids = teamIds as string[];
      const groupMatches = activeChamp.matches.filter(m => m.stage === 'Fase de Grupos' && m.groupId === groupId);
      const stats: Record<string, StandingRow> = {};
      
      ids.forEach(tid => {
        const team = activeChamp.teams.find(t => t.id === tid)!;
        stats[tid] = {
          teamId: tid, teamName: team.name, isHuman: team.isHuman,
          played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, lastFive: [], groupId
        };
      });

      groupMatches.forEach(m => {
        if (m.homeScore !== null && m.awayScore !== null) {
          const h = stats[m.homeId];
          const a = stats[m.awayId];
          if (!h || !a) return;
          h.played++; a.played++;
          h.gf += m.homeScore; h.ga += m.awayScore;
          a.gf += m.awayScore; a.ga += m.homeScore;
          if (m.homeScore > m.awayScore) {
            h.won++; h.points += 3; a.lost++;
            h.lastFive.push('W'); a.lastFive.push('L');
          } else if (m.homeScore < m.awayScore) {
            a.won++; a.points += 3; h.lost++;
            a.lastFive.push('W'); h.lastFive.push('L');
          } else {
            h.drawn++; a.drawn++; h.points += 1; a.points += 1;
            h.lastFive.push('D'); a.lastFive.push('D');
          }
          h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
        }
      });

      results[groupId] = Object.values(stats).sort((a, b) => b.points - a.points || b.won - a.won || b.gd - a.gd || b.gf - a.gf);
    });

    return results;
  }, [activeChamp]);

  const advanceCup = () => {
    if (!activeChamp || activeChamp.type !== 'cup') return;
    
    const currentMatches = activeChamp.matches;
    const stageToFinish = activeChamp.currentStage === 'group' ? 'Fase de Grupos' : 
                          activeChamp.currentStage === 'semifinal' ? 'Semifinal' : 'Final';
    
    const isStageFinished = currentMatches
      .filter(m => m.stage === stageToFinish)
      .every(m => m.homeScore !== null);

    if (!isStageFinished) return alert("Complete todos os jogos da fase atual antes de avançar!");

    const maxRoundSoFar = Math.max(0, ...currentMatches.map(m => m.round));

    if (activeChamp.currentStage === 'group') {
      const gA = standingsByGroup['A'];
      const gB = standingsByGroup['B'];
      
      if (!gA || !gB) return alert("Erro nos grupos!");

      // Cruzamento Olímpico: 1ºA x 2ºB e 1ºB x 2ºA
      const semis: Match[] = [
        // Semi 1: 1A x 2B
        { id: `semi-1-ida`, homeId: gB[1].teamId, awayId: gA[0].teamId, homeScore: null, awayScore: null, round: maxRoundSoFar + 1, stage: 'Semifinal', leg: 'Ida' },
        { id: `semi-1-volta`, homeId: gA[0].teamId, awayId: gB[1].teamId, homeScore: null, awayScore: null, round: maxRoundSoFar + 2, stage: 'Semifinal', leg: 'Volta' },
        // Semi 2: 1B x 2A
        { id: `semi-2-ida`, homeId: gA[1].teamId, awayId: gB[0].teamId, homeScore: null, awayScore: null, round: maxRoundSoFar + 1, stage: 'Semifinal', leg: 'Ida' },
        { id: `semi-2-volta`, homeId: gB[0].teamId, awayId: gA[1].teamId, homeScore: null, awayScore: null, round: maxRoundSoFar + 2, stage: 'Semifinal', leg: 'Volta' },
      ];
      setChampionships(prev => prev.map(c => c.id === activeChamp.id ? { ...c, matches: [...c.matches, ...semis], currentStage: 'semifinal' } : c));
      setActiveTab('matches');
    } else if (activeChamp.currentStage === 'semifinal') {
      const getWinnerId = (matchIda: Match, matchVolta: Match) => {
        const totalA = (matchIda.awayScore || 0) + (matchVolta.homeScore || 0); // O "Visitante" da ida é o "Mandante" da volta
        const totalB = (matchIda.homeScore || 0) + (matchVolta.awayScore || 0); 
        if (totalA > totalB) return matchVolta.homeId;
        if (totalB > totalA) return matchVolta.awayId;
        return matchVolta.homeId; // Critério de desempate simplificado (vantagem melhor campanha)
      };

      const w1 = getWinnerId(currentMatches.find(m => m.id === 'semi-1-ida')!, currentMatches.find(m => m.id === 'semi-1-volta')!);
      const w2 = getWinnerId(currentMatches.find(m => m.id === 'semi-2-ida')!, currentMatches.find(m => m.id === 'semi-2-volta')!);

      const finals: Match[] = [
        { id: `final-ida`, homeId: w2, awayId: w1, homeScore: null, awayScore: null, round: maxRoundSoFar + 1, stage: 'Final', leg: 'Ida' },
        { id: `final-volta`, homeId: w1, awayId: w2, homeScore: null, awayScore: null, round: maxRoundSoFar + 2, stage: 'Final', leg: 'Volta' },
      ];
      setChampionships(prev => prev.map(c => c.id === activeChamp.id ? { ...c, matches: [...c.matches, ...finals], currentStage: 'final' } : c));
      setActiveTab('matches');
    }
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

  // Fixed 'unknown' type error when accessing teamId on flattened standings array
  const currentChampion = useMemo((): StandingRow | undefined => {
    if (!activeChamp) return undefined;
    const groupValues = Object.values(standingsByGroup) as StandingRow[][];
    if (activeChamp.type === 'league') return groupValues[0]?.[0];
    
    const fv = activeChamp.matches.find(m => m.stage === 'Final' && m.leg === 'Volta');
    const fi = activeChamp.matches.find(m => m.stage === 'Final' && m.leg === 'Ida');
    if (fv && fi && fv.homeScore !== null && fi.homeScore !== null) {
      const totalA = (fi.awayScore || 0) + (fv.homeScore || 0);
      const totalB = (fi.homeScore || 0) + (fv.awayScore || 0);
      const winnerId = totalA >= totalB ? fv.homeId : fv.awayId;
      // Cast to StandingRow[] to allow property access on flattened elements
      const allStandings = groupValues.flat() as StandingRow[];
      return allStandings.find(s => s.teamId === winnerId);
    }
    return undefined;
  }, [activeChamp, standingsByGroup]);

  const deleteChampionship = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Excluir permanentemente?")) {
      setChampionships(prev => prev.filter(c => c.id !== id));
      await deleteChampionshipFromCloud(id);
      if (activeChampId === id) setAppState('dashboard');
    }
  };

  if (appState === 'home') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center selection:bg-blue-500/30">
        <Home onContinue={() => setAppState('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">⚽</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter hidden sm:block uppercase leading-none">Super League</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : syncStatus === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{syncStatus === 'syncing' ? 'Sincronizando...' : 'Cloud'}</span>
              </div>
            </div>
          </div>
          {appState === 'active_tournament' && activeChamp && (
            <nav className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 gap-1">
              <button onClick={() => setActiveTab('table')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Tabelas</button>
              <button onClick={() => setActiveTab('matches')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Partidas</button>
            </nav>
          )}
          <div className="flex gap-2">
            {appState !== 'dashboard' && <button onClick={() => setAppState('dashboard')} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-black uppercase rounded-xl border border-slate-700">Painel</button>}
            <button onClick={() => setAppState('create')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20">+ Criar</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {appState === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">Meus <span className="text-blue-500">Torneios</span></h2>
            </div>
            {championships.length === 0 ? (
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-[3rem] p-20 text-center flex flex-col items-center gap-6">
                <p className="text-slate-500 font-bold uppercase tracking-widest">Inicie seu primeiro torneio hoje.</p>
                <button onClick={() => setAppState('create')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Começar</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {championships.map(c => (
                  <div key={c.id} onClick={() => { setActiveChampId(c.id); setAppState('active_tournament'); setActiveTab('table'); }} className="bg-slate-800/80 border border-slate-700 p-8 rounded-[2.5rem] shadow-xl hover:border-blue-500/40 transition-all group relative overflow-hidden cursor-pointer flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.type === 'league' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.type === 'league' ? 'Liga' : 'Copa'}</span>
                      <button onClick={(e) => deleteChampionship(e, c.id)} className="text-slate-600 hover:text-rose-500 transition-colors">✕</button>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter truncate group-hover:text-blue-400">{c.name}</h3>
                    <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className="text-blue-500 group-hover:translate-x-1 transition-transform">Abrir →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {appState === 'create' && <SetupForm onCancel={() => setAppState('dashboard')} onStart={handleStartTournament} />}

        {appState === 'active_tournament' && activeChamp && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">{activeChamp.type === 'league' ? 'PONTOS CORRIDOS' : `COPA - ${activeChamp.currentStage.toUpperCase()}`}</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">{activeChamp.name}</h2>
              </div>
              {activeChamp.type === 'cup' && activeChamp.currentStage !== 'final' && (
                <button onClick={advanceCup} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Avançar Fase</button>
              )}
            </div>
            
            {activeTab === 'table' && (
              <div className="space-y-10">
                {Object.entries(standingsByGroup).map(([groupId, groupStandings]) => (
                  <div key={groupId} className="space-y-4">
                    {activeChamp.type === 'cup' && <h3 className="text-xl font-black text-white px-6 uppercase tracking-widest italic">Grupo {groupId}</h3>}
                    <LeagueTable standings={groupStandings} teams={activeChamp.teams} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'matches' && (
              <MatchList 
                matches={activeChamp.matches} 
                teams={activeChamp.teams} 
                onUpdateScore={updateScore} 
                onShowResults={() => setShowChampionModal(true)}
                tournamentType={activeChamp.type}
              />
            )}
          </div>
        )}
      </main>

      {showChampionModal && activeChamp && (
        <ChampionModal 
          champion={currentChampion} 
          teamDetails={activeChamp.teams.find(t => t.id === currentChampion?.teamId)} 
          onClose={() => setShowChampionModal(false)}
          type={activeChamp.type}
        />
      )}
    </div>
  );
};

export default App;
