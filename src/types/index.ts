export interface User {
  id: string;
  email: string;
}

export interface Match {
  id: string;
  league: string;
  home_team: string;
  away_team: string;
  score_home: number | null;
  score_away: number | null;
  start_time: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface Favorite {
  id: string;
  user_id: string;
  team_name: string;
}

export interface Notification {
  id: string;
  user_id: string;
  match_id: string;
  type: 'goal' | 'start' | 'end' | 'upcoming';
  read: boolean;
  created_at: string;
}