
import { Player } from "./types";

export const DEFAULT_BOT_NAMES = [
  "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Atlético-MG", "Grêmio"
];

export const TEAM_COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
];

export const TOTAL_TEAMS = 6;

const FIRST_NAMES = ["Gabriel", "Lucas", "Mateus", "Bruno", "Rodrigo", "Thiago", "Vinícius", "Éverton", "Yuri", "Igor"];
const LAST_NAMES = ["Barbosa", "Gomez", "Silva", "Oliveira", "Santos", "Pinto", "Pereira", "Veiga", "Arrascaeta", "Hulk"];

export function generateRandomPlayer(pos: 'GOL' | 'DEF' | 'MEI' | 'ATA'): Player {
  const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  const rating = 65 + Math.floor(Math.random() * 25);
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    position: pos,
    rating,
    value: rating * 100000 + (Math.random() * 500000)
  };
}
