
import React from 'react';
import { Team } from '../types';

interface Props {
  activeTeam: Team;
  onUpdateFinances: (teamId: string, sponsorship: number, salaries: number) => void;
  onProcessCycle: (teamId: string) => void;
}

const BudgetControl: React.FC<Props> = ({ activeTeam, onUpdateFinances, onProcessCycle }) => {
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const netGain = activeTeam.sponsorship - activeTeam.salaries;
  const healthPercentage = Math.min(100, Math.max(0, (activeTeam.sponsorship / (activeTeam.salaries || 1)) * 50));

  const handleSponsorshipChange = (val: string) => {
    const num = parseInt(val) || 0;
    onUpdateFinances(activeTeam.id, num, activeTeam.salaries);
  };

  const handleSalariesChange = (val: string) => {
    const num = parseInt(val) || 0;
    onUpdateFinances(activeTeam.id, activeTeam.sponsorship, num);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Saldo em Caixa</p>
          <p className="text-3xl font-black text-white">{formatMoney(activeTeam.budget)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Saúde Financeira</p>
            <span className={`text-xs font-bold ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netGain >= 0 ? 'ESTÁVEL' : 'DÉFICIT'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${netGain >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-600/20 flex flex-col justify-center items-center group cursor-pointer active:scale-95 transition-all" onClick={() => onProcessCycle(activeTeam.id)}>
          <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-1">Fechar Ciclo Mensal</p>
          <p className="text-xl font-black text-white">PROCESSAR BALANÇO</p>
          <p className="text-[10px] text-white/50 mt-1">Clique para aplicar ganhos/gastos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel de Edição */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700 bg-slate-900/30">
            <h3 className="text-white font-black uppercase tracking-tighter flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-500 rounded"></span>
              Controle de Fluxo
            </h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Receita de Patrocínio</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xs">R$</span>
                  <input 
                    type="number"
                    value={activeTeam.sponsorship}
                    onChange={(e) => handleSponsorshipChange(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-emerald-400 font-black text-right w-44 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max="5000000"
                step="1"
                value={activeTeam.sponsorship}
                onChange={(e) => handleSponsorshipChange(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span>R$ 0</span>
                <span className="text-emerald-500/50">{formatMoney(activeTeam.sponsorship)}</span>
                <span>R$ 5.0M</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Folha Salarial</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-black text-xs">R$</span>
                  <input 
                    type="number"
                    value={activeTeam.salaries}
                    onChange={(e) => handleSalariesChange(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-rose-400 font-black text-right w-44 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  />
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max="5000000"
                step="1"
                value={activeTeam.salaries}
                onChange={(e) => handleSalariesChange(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span>R$ 0</span>
                <span className="text-rose-500/50">{formatMoney(activeTeam.salaries)}</span>
                <span>R$ 5.0M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo do Balanço */}
        <div className="bg-slate-900/50 border border-slate-700 border-dashed rounded-3xl p-8 flex flex-col justify-center">
          <h4 className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-8 text-center italic">Projeção do Próximo Mês</h4>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center group">
              <span className="text-slate-400 font-bold">Total Recebido (+)</span>
              <span className="text-emerald-400 font-black text-lg group-hover:scale-110 transition-transform">
                {formatMoney(activeTeam.sponsorship)}
              </span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-slate-400 font-bold">Total Descontado (-)</span>
              <span className="text-rose-400 font-black text-lg group-hover:scale-110 transition-transform">
                {formatMoney(activeTeam.salaries)}
              </span>
            </div>
            <div className="pt-6 border-t border-slate-700 flex justify-between items-center">
              <span className="text-white font-black uppercase tracking-widest">Resultado Líquido</span>
              <div className="text-right">
                <p className={`text-2xl font-black ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netGain >= 0 ? '+' : ''}{formatMoney(netGain)}
                </p>
                <p className="text-[10px] text-slate-500 font-bold">Impacto direto no saldo</p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-[11px] text-blue-400 leading-relaxed italic text-center">
              "Um bom gestor equilibra a paixão do campo com a razão do bolso. Ajuste os valores digitando nos campos acima ou deslizando os controles."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetControl;
