
import React, { useState, useMemo } from 'react';
import { Team, Match, StandingRow, AppState, ActiveTab } from './types';
import SetupForm from './components/SetupForm';
import LeagueTable from './components/LeagueTable';
import MatchList from './components/MatchList';
import BudgetControl from './components/BudgetControl';
import ChampionModal from './components/ChampionModal';
import { getLeagueAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('setup');
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChampionModal, setShowChampionModal] = useState(false);

  const generateSchedule = (teamList: Team[]) => {
    const rounds: Match[] = [];
    const n = teamList.length;
    const teamIds = teamList.map(t => t.id);

    // Round Robin Algorithm (Circle Method)
    for (let round = 0; round < n - 1; round++) {
      for (let i = 0; i < n / 2; i++) {
        const home = teamIds[i];
        const away = teamIds[n - 1 - i];
        rounds.push({
          id: `match-${round}-${i}`,
          homeId: home,
          awayId: away,
          homeScore: null,
          awayScore: null,
          homeEarnings: 0,
          awayEarnings: 0,
          round: round + 1
        });
      }
      // Rotate teams (keeping first one fixed)
      const last = teamIds.pop()!;
      teamIds.splice(1, 0, last);
    }

    // Second Half (Return matches)
    const secondHalf = rounds.map(m => ({
      ...m,
      id: `match-ret-${m.id}`,
      homeId: m.awayId,
      awayId: m.homeId,
      round: m.round + (n - 1)
    }));

    return [...rounds, ...secondHalf];
  };

  const handleStart = (selectedTeams: Team[]) => {
    setTeams(selectedTeams);
    setMatches(generateSchedule(selectedTeams));
    setAppState('league');
  };

  const updateScore = (matchId: string, homeScore: number, awayScore: number) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, homeScore, awayScore } : m));
  };

  const updateEarnings = (matchId: string, homeEarnings: number, awayEarnings: number) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, homeEarnings, awayEarnings } : m));
  };

  const updateTeamFinances = (teamId: string, sponsorship: number, salaries: number) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, sponsorship, salaries } : t));
  };

  const processFinancialCycle = (teamId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const net = t.sponsorship - t.salaries;
        return { ...t, budget: t.budget + net };
      }
      return t;
    }));
  };

  const processAllTeamsFinances = () => {
    setTeams(prev => prev.map(t => {
      const net = t.sponsorship - t.salaries;
      return { ...t, budget: t.budget + net };
    }));
    alert("Balanço financeiro processado para todos os clubes! (Receitas - Despesas)");
  };

  const standings = useMemo(() => {
    const stats: Record<string, StandingRow> = {};
    teams.forEach(t => {
      stats[t.id] = {
        teamId: t.id, 
        teamName: t.name, 
        isHuman: t.isHuman,
        played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, 
        currentBudget: t.budget,
        lastFive: []
      };
    });

    const resultsByTeam: Record<string, ('W' | 'D' | 'L')[]> = {};
    teams.forEach(t => resultsByTeam[t.id] = []);

    matches.forEach(m => {
      // O orçamento na tabela reflete os ganhos de partida acumulados
      if (stats[m.homeId]) stats[m.homeId].currentBudget += (m.homeEarnings || 0);
      if (stats[m.awayId]) stats[m.awayId].currentBudget += (m.awayEarnings || 0);

      if (m.homeScore !== null && m.awayScore !== null) {
        const h = stats[m.homeId];
        const a = stats[m.awayId];
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
        h.gd = h.gf - h.ga;
        a.gd = a.gf - a.ga;
      }
    });

    return Object.values(stats)
      .map(s => ({ ...s, lastFive: resultsByTeam[s.teamId].slice(-5).reverse() }))
      .sort((a, b) => (b.points - a.points) || (b.won - a.won) || (b.gd - a.gd) || (b.gf - a.gf));
  }, [matches, teams]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getLeagueAnalysis(standings, teams);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const humanTeam = teams.find(t => t.isHuman) || teams[0];
  const champion = standings[0];

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter hidden sm:block uppercase">Brasileirão Manager</h1>
          </div>
          
          {appState === 'league' && (
            <nav className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 overflow-x-auto gap-1">
              <button onClick={() => setActiveTab('table')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Tabela</button>
              <button onClick={() => setActiveTab('matches')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'matches' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Jogos</button>
              <button onClick={() => setActiveTab('budget')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'budget' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Orçamento</button>
              <button onClick={() => setActiveTab('stadiums')} className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'stadiums' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Estádios</button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {appState === 'setup' ? (
          <SetupForm onStart={handleStart} />
        ) : (
          <div className="space-y-8">
            {activeTab === 'table' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <LeagueTable standings={standings} />
                </div>
                <div className="space-y-6">
                  <section className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded"></span> Narrador AI
                    </h3>
                    {analysis ? (
                      <p className="text-slate-300 text-sm italic leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700 whitespace-pre-wrap">{analysis}</p>
                    ) : (
                      <p className="text-slate-500 text-sm italic">O narrador está esperando a rodada acabar para comentar!</p>
                    )}
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing} 
                      className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? 'Analisando...' : 'Pedir Comentário'}
                    </button>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <MatchList 
                matches={matches} 
                teams={teams} 
                onUpdateScore={updateScore} 
                onUpdateEarnings={updateEarnings}
                onProcessBudgets={processAllTeamsFinances}
                onShowResults={() => setShowChampionModal(true)}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetControl 
                activeTeam={humanTeam} 
                onUpdateFinances={updateTeamFinances}
                onProcessCycle={processFinancialCycle}
              />
            )}

            {activeTab === 'stadiums' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl group">
                    <div className="h-28 relative overflow-hidden bg-slate-900 flex items-center justify-center">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(45deg, ${team.color} 25%, transparent 25%, transparent 50%, ${team.color} 50%, ${team.color} 75%, transparent 75%, transparent)` , backgroundSize: '40px 40px'}}></div>
                       <span className="text-6xl font-black text-white/5 uppercase select-none">{team.name}</span>
                    </div>
                    <div className="p-6">
                      <h4 className="text-white font-black text-lg mb-1">{team.stadium.name}</h4>
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-4">Mando de Campo: {team.name}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Capacidade</span>
                        <span className="text-white font-bold">{team.stadium.capacity.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showChampionModal && (
        <ChampionModal 
          champion={champion} 
          teamDetails={teams.find(t => t.id === champion.teamId)} 
          onClose={() => setShowChampionModal(false)} 
        />
      )}
    </div>
  );
};

export default App;
