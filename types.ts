
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
  logoUrl?: string;
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
  stage: 'Fase de Grupos' | 'Oitavas' | 'Quartas' | 'Semifinal' | 'Final';
  leg?: 'Ida' | 'Volta';
  groupId?: string; // Para identificar a qual grupo a partida pertence
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
  groupId?: string;
}

export type TournamentType = 'league' | 'cup';

export interface Championship {
  id: string;
  name: string;
  type: TournamentType;
  teams: Team[];
  matches: Match[];
  status: 'active' | 'finished';
  currentStage: 'group' | 'quarter' | 'semifinal' | 'final';
  createdAt: number;
  teamGroups?: Record<string, string[]>; // groupId -> array of teamIds
}

export type AppState = 'home' | 'dashboard' | 'create' | 'active_tournament';
export type ActiveTab = 'table' | 'matches' | 'stadiums';

export interface SavedTeam {
  id: string;
  name: string;
  playerName: string;
  stadiumName: string;
  color: string;
  logoUrl?: string;
}
