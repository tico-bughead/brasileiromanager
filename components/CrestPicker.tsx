import React from 'react';
import { PRE_GENERATED_CRESTS } from '../constants';

interface Props {
  onSelect: (value: string) => void;
  onClose: () => void;
  teamColor: string;
}

const CrestPicker: React.FC<Props> = ({ onSelect, onClose, teamColor }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Escolher Brasão</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Coleção Exclusiva Super League</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {(PRE_GENERATED_CRESTS as any[]).map((crest) => (
              <button
                key={crest.id}
                onClick={() => {
                  onSelect(crest.type === 'emoji' ? crest.symbol! : crest.value!);
                  onClose();
                }}
                className="group flex flex-col items-center gap-2 transition-all"
              >
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-700 group-hover:scale-110 group-hover:border-blue-500 transition-all overflow-hidden"
                  style={{ backgroundColor: crest.type === 'emoji' ? teamColor : '#ffffff' }}
                >
                  {crest.type === 'emoji' ? (
                    <span className="text-4xl">{crest.symbol}</span>
                  ) : (
                    <img 
                      src={crest.value} 
                      className="w-full h-full object-contain p-2" 
                      alt={crest.label}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-black text-xl">${crest.label[0]}</span>`;
                          parent.style.backgroundColor = teamColor;
                        }
                      }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white text-center truncate w-full">{crest.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-800/30 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
            "Identidade Visual personalizada para seu clube"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrestPicker;
