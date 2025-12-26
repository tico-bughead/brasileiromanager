
import { GoogleGenAI } from "@google/genai";
import { StandingRow, Match, Team } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLeagueAnalysis(standings: StandingRow[], teams: Team[]) {
  const standingsContext = standings.map((s, idx) => 
    `${idx + 1}. ${s.teamName} (${s.isHuman ? 'Player: ' + teams.find(t => t.id === s.teamId)?.playerName : 'AI'}): ${s.points}pts, ${s.won}W, GD: ${s.gd}`
  ).join('\n');

  const prompt = `
    Você é um comentarista esportivo sarcástico e divertido.
    Analise a seguinte tabela classificatória de uma liga de 6 times (Brasileirão Style):
    
    ${standingsContext}
    
    Dê um resumo curto (máximo 3 parágrafos) sobre quem está dominando, quem está passando vergonha e faça uma previsão engraçada para o final da temporada. 
    Lembre-se: mencione nomes de jogadores humanos se houver algum. Use termos do futebol brasileiro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "O narrador perdeu a voz! (Erro ao gerar comentário)";
  }
}
