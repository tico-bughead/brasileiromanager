
export interface Player {
  id: string;
  name: string;
  position: 'GOL' | 'DEF' | 'MEI' | 'ATA';
  rating: number;
  value: number;
}

export interface Stadium {
  name: string;
  primaryColor: string;
  capacity: number;
}

export interface Team {
  id: string;
  name: string;
  playerName: string;
  isHuman: boolean;
  color: string;
  stadium: Stadium;
  initialBudget: number;
  budget: number;
  sponsorship: number; // Ganhos recorrentes
  salaries: number;    // Gastos recorrentes
  players: Player[];
}

export interface Match {
  id: string;
  homeId: string;
  awayId: string;
  homeScore: number | null;
  awayScore: number | null;
  homeEarnings: number;
  awayEarnings: number;
  round: number;
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  isHuman: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  currentBudget: number;
  lastFive: ('W' | 'D' | 'L' | '-')[];
}

export type AppState = 'home' | 'setup' | 'league';
export type ActiveTab = 'table' | 'matches' | 'stadiums' | 'budget';
