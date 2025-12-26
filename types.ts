
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
  players: Player[];
  budget: number;
  sponsorship: number;
  salaries: number;
}

export interface Match {
  id: string;
  homeId: string;
  awayId: string;
  homeScore: number | null;
  awayScore: number | null;
  round: number;
  stage?: string; // Para Copas: 'Final', 'Semi', etc.
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
  lastFive: ('W' | 'D' | 'L' | '-')[];
}

export type TournamentType = 'league' | 'cup';

export interface Championship {
  id: string;
  name: string;
  type: TournamentType;
  teams: Team[];
  matches: Match[];
  status: 'active' | 'finished';
  createdAt: number;
}

export type AppState = 'dashboard' | 'create' | 'active_tournament';
export type ActiveTab = 'table' | 'matches' | 'stadiums' | 'bracket';
