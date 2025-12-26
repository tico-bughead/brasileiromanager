import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';

interface Props {
  onImageGenerated: (base64: string) => void;
  onClose: () => void;
  defaultTeamName: string;
  defaultColor: string;
}

type ImageSize = '1K' | '2K' | '4K';

const AIImageGenerator: React.FC<Props> = ({ onImageGenerated, onClose, defaultTeamName, defaultColor }) => {
  const [prompt, setPrompt] = useState(`A professional football team crest for "${defaultTeamName}", modern style, circular shield, primary color ${defaultColor}, high quality, minimalist vector art.`);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  const loadingMessages = [
    "Desenhando as primeiras linhas...",
    "Escolhendo as cores da glória...",
    "Refinando os detalhes do escudo...",
    "Finalizando sua obra de arte...",
    "Quase pronto para o campo!"
  ];

  const handleOpenSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      setError(null);
    } catch (err) {
      setError("Falha ao abrir o seletor de chave.");
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    setError(null);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[msgIndex % loadingMessages.length]);
      msgIndex++;
    }, 3000);

    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await handleOpenSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize
          }
        },
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("A IA não retornou candidatos.");

      let foundImage = false;
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
          setGeneratedImage(imageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("Nenhuma imagem encontrada na resposta da IA.");
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      const errorMsg = err.message || JSON.stringify(err);
      
      if (errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("not found")) {
        setError("Erro 403: Este modelo (Gemini 3 Pro Image) exige faturamento ativado (Paid Project).");
        await window.aistudio.openSelectKey();
      } else {
        setError("Erro ao gerar imagem. Verifique se sua conta tem créditos ou se a descrição é permitida.");
      }
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Gerador de Brasão AI</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Gemini 3 Pro Image (Beta)</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {!generatedImage && !isGenerating && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Descrição</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 min-h-[120px] transition-all"
                  placeholder="Ex: Escudo redondo, moderno, com águia dourada..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Resolução</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-3 rounded-xl font-black text-xs transition-all border ${
                        imageSize === size 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg' 
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🎨</div>
              </div>
              <p className="text-white font-black text-xl animate-pulse text-center px-4">{loadingMessage}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Requer API Key com faturamento</p>
            </div>
          )}

          {generatedImage && !isGenerating && (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="bg-slate-950 rounded-3xl p-4 border border-slate-700 flex justify-center shadow-inner">
                <img src={generatedImage} className="max-w-full max-h-[350px] rounded-2xl shadow-2xl object-contain" alt="Generated" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setGeneratedImage(null)} className="flex-1 py-4 bg-slate-800 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-700 transition-all">Novo Prompt</button>
                <button onClick={() => { onImageGenerated(generatedImage); onClose(); }} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all">Usar Brasão</button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl space-y-4">
              <p className="text-rose-500 text-xs font-bold text-center leading-relaxed">{error}</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleOpenSelectKey} className="w-full py-3 bg-rose-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-rose-500 transition-all">Trocar API Key</button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-center text-blue-400 text-[10px] font-black uppercase hover:underline">Ver Documentação de Faturamento</a>
              </div>
            </div>
          )}
        </div>

        {!generatedImage && !isGenerating && (
          <div className="p-8 bg-slate-800/30 border-t border-slate-800 flex flex-col gap-4">
            <button onClick={generate} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20">✨ Gerar com IA</button>
            <p className="text-center text-[9px] text-slate-500 font-bold uppercase">Uso restrito a projetos pagos no Google AI Studio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImageGenerator;
