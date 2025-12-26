
import React from 'react';
import { StandingRow } from '../types';

interface Props {
  standings: StandingRow[];
}

const LeagueTable: React.FC<Props> = ({ standings }) => {
  const formatMoney = (val: number) => `R$ ${(val / 1000000).toFixed(1)}M`;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Pos</th>
              <th className="px-4 py-3 font-semibold">Equipe</th>
              <th className="px-4 py-3 font-semibold text-center">P</th>
              <th className="px-4 py-3 font-semibold text-center">J</th>
              <th className="px-4 py-3 font-semibold text-center">V</th>
              <th className="px-4 py-3 font-semibold text-center">SG</th>
              <th className="px-4 py-3 font-semibold text-center">Orçamento</th>
              <th className="px-4 py-3 font-semibold text-center hidden md:table-cell">Últimos 5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {standings.map((row, index) => (
              <tr 
                key={row.teamId} 
                className={`hover:bg-slate-700/30 transition-colors ${index < 1 ? 'bg-blue-500/10' : index > 4 ? 'bg-red-500/10' : ''}`}
              >
                <td className="px-4 py-4 font-bold text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={`w-1 h-6 rounded-full ${index < 1 ? 'bg-blue-500' : index > 4 ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                    {index + 1}º
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white flex items-center gap-2">
                      {row.teamName}
                      {row.isHuman && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">HUMANO</span>}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-black text-white">{row.points}</td>
                <td className="px-4 py-4 text-center text-slate-400">{row.played}</td>
                <td className="px-4 py-4 text-center text-slate-400">{row.won}</td>
                <td className="px-4 py-4 text-center font-medium text-slate-200">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="px-4 py-4 text-center font-bold text-emerald-400 whitespace-nowrap">
                  {formatMoney(row.currentBudget)}
                </td>
                <td className="px-4 py-4 text-center hidden md:table-cell">
                  <div className="flex gap-1 justify-center">
                    {row.lastFive.map((res, i) => (
                      <span 
                        key={i} 
                        className={`w-5 h-5 flex items-center justify-center rounded-sm text-[10px] font-bold ${
                          res === 'W' ? 'bg-emerald-500 text-white' : 
                          res === 'D' ? 'bg-slate-500 text-white' : 
                          res === 'L' ? 'bg-rose-500 text-white' : 'bg-slate-700/50'
                        }`}
                      >
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
      <div className="p-4 bg-slate-900/30 text-xs text-slate-500 flex gap-6">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Campeão / Libertadores</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Rebaixamento</div>
      </div>
    </div>
  );
};

export default LeagueTable;
