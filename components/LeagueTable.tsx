
import React from 'react';
import { StandingRow, Team } from '../types';

interface Props {
  standings: StandingRow[];
  teams?: Team[];
}

const LeagueTable: React.FC<Props> = ({ standings, teams = [] }) => {
  const getLogo = (id: string) => teams.find(t => t.id === id)?.logoUrl;
  const getColor = (id: string) => teams.find(t => t.id === id)?.color || '#3b82f6';

  return (
    <div className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Clube</th>
              <th className="px-6 py-4 text-center">P</th>
              <th className="px-6 py-4 text-center">J</th>
              <th className="px-6 py-4 text-center">V</th>
              <th className="px-6 py-4 text-center">SG</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Últimas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {standings.map((row, index) => (
              <tr 
                key={row.teamId} 
                className={`hover:bg-slate-700/30 transition-colors ${index === 0 ? 'bg-blue-500/5' : ''}`}
              >
                <td className="px-6 py-5 font-black text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className={`w-1 h-6 rounded-full ${index < 2 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-600'}`}></span>
                    {index + 1}º
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-white font-black text-lg border border-slate-700"
                      style={{ backgroundColor: getColor(row.teamId) }}
                    >
                      {(() => {
                        const logo = getLogo(row.teamId);
                        if (!logo) return row.teamName[0];
                        if (logo.includes('data:image') || logo.startsWith('http')) {
                          return <img src={logo} className="w-full h-full object-contain p-1.5" alt={row.teamName} />;
                        }
                        return <span className="text-xl">{logo}</span>;
                      })()}
                    </div>
                    <span className="font-black text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">
                      {row.teamName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-black text-white text-lg">{row.points}</td>
                <td className="px-6 py-5 text-center text-slate-400 font-bold">{row.played}</td>
                <td className="px-6 py-5 text-center text-slate-400 font-bold">{row.won}</td>
                <td className="px-6 py-5 text-center font-black text-slate-200">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="px-6 py-5 text-center hidden md:table-cell">
                  <div className="flex gap-1 justify-center">
                    {row.lastFive.slice(-3).map((res, i) => (
                      <span key={i} className={`w-5 h-5 flex items-center justify-center rounded-md text-[8px] font-black ${res === 'W' ? 'bg-emerald-500/20 text-emerald-400' : res === 'D' ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-900/30 text-[8px] font-black text-slate-600 uppercase tracking-widest flex gap-4 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> G2 / Semifinal</div>
      </div>
    </div>
  );
};

export default LeagueTable;
