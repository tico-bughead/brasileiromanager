import { Player } from "./types";

export const DEFAULT_BOT_NAMES = [
  "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Atlético-MG", "Grêmio"
];

export const TEAM_COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
];

export const TOTAL_TEAMS = 6;

// Brasões oficiais convertidos para Base64 (SVG para manter leveza e qualidade)
export const OFFICIAL_LOGOS = [
  { 
    id: 'off1', 
    label: 'F.C.E. Flames', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgMTBDMTAgMTAgMTAgNzAgNTAgOTBDOTAgNzAgOTAgMTAgOTAgMTBaIiBmaWxsPSIjMUI5Q0ZDIi8+PHBhdGggZD0iTTUwIDE1TDU4IDIySDQyWk01MCAzMEM0MCA1MCA0NSA2MCA0NSA3MEM0NSA4MCA1NSA4MCA1NSA3MEM1NSA2MCA2MCA1MCA1MCAzMFoiIGZpbGw9IiNGRjg1MzAiLz48cGF0aCBkPSJNMzUgNDBDMzAgNTAgMzAgNjAgMzAgNzBDMzAgODAgNDAgODAgNDAgNzBDNDAgNjAgNDAgNTAgMzUgNDBaIiBmaWxsPSIjRkY4NTMwIi8+PHBhdGggZD0iTTY1IDQwQzcwIDUwIDcwIDYwIDcwIDcwQzcwIDgwIDYwIDgwIDYwIDcwQzYwIDYwIDYwIDUwIDY1IDQwWiIgZmlsbD0iI0ZGODUzMCIvPjwvc3ZnPg=='
  },
  { 
    id: 'off2', 
    label: 'Thunder Bolt', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgNTAgNTApIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTU1IDE1TDM1IDU1SDUwTDUwIDg1TDcwIDQ1SDU1WiIgZmlsbD0iI0ZGRDAwMCIvPjwvc3ZnPg=='
  },
  { 
    id: 'off3', 
    label: 'Green Tree', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIxMCIgeT0iMzAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjMzY2MzM5Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI0NSIgcj0iMTUiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSI0NyIgeT0iNTUiIHdpZHRoPSI2IixoZWlnaHQ9IjUiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4='
  },
  { 
    id: 'off4', 
    label: 'Royal Crown V', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAgMTBDMjAgNzAgNTAgOTAgODAgNzBDODAgMTAgODAgMTAgODAgMTBaIiBmaWxsPSIjQzgyRTMxIi8+PHBhdGggZD0iTTUwIDE1TDU4IDI1SDQyWk0zNSAyNUw0MCAzMEgzMFpNNjAgMjVMNjUgMzBINTVaIiBmaWxsPSIjRERCMjNEIi8+PHBhdGggZD0iTTM1IDQwTDUwIDgwTDY1IDQwSDU1TDUwIDYwTDQ1IDQwWiIgZmlsbD0iI0REQjIzRCIvPjwvc3ZnPg=='
  },
  { 
    id: 'off5', 
    label: 'F.C.M. Hex', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAgNUw5MCAyNVY3NUw1MCA5NUwxMCA3NVYyNVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMyM0E0MCIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHJlY3QgeD0iNDAiIHk9IjMwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNFMDUwMjMiLz48dGV4dCB4PSI1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMjNBNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkYuQy5NPC90ZXh0Pjwvc3ZnPg=='
  },
  { 
    id: 'off6', 
    label: 'North Star', 
    type: 'image', 
    value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzA4MUY0MCIvPjxwYXRoIGQ9Ik01MCAxMEw1OCA0Mkg5MEw2MiA1OEw3MiA5MEw1MCA3MEwyOCA5MEwzOCA1OEwxMCA0Mkg0MloiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4='
  },
];

export const PRE_GENERATED_CRESTS = [
  ...OFFICIAL_LOGOS,
  { id: 'c1', symbol: '🦁', label: 'Leão', type: 'emoji' },
  { id: 'c2', symbol: '🦅', label: 'Águia', type: 'emoji' },
  { id: 'c3', symbol: '🛡️', label: 'Escudo', type: 'emoji' },
  { id: 'c4', symbol: '⚽', label: 'Bola', type: 'emoji' },
  { id: 'c5', symbol: '👑', label: 'Coroa', type: 'emoji' },
  { id: 'c6', symbol: '⭐', label: 'Estrela', type: 'emoji' },
];

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
