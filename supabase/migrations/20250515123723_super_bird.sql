-- Seed data for matches
INSERT INTO matches (league, home_team, away_team, score_home, score_away, start_time, status, odds)
VALUES
  -- Live matches
  ('Premier League', 'Arsenal', 'Manchester United', 2, 1, now(), 'live', '{"home": 1.80, "draw": 3.40, "away": 4.50}'),
  ('La Liga', 'Barcelona', 'Real Madrid', 1, 1, now(), 'live', '{"home": 2.10, "draw": 3.20, "away": 3.50}'),
  ('Serie A', 'Juventus', 'Inter Milan', 0, 0, now(), 'live', '{"home": 2.40, "draw": 3.10, "away": 3.00}'),
  ('Bundesliga', 'Bayern Munich', 'Borussia Dortmund', 3, 1, now(), 'live', '{"home": 1.60, "draw": 4.00, "away": 5.50}'),
  
  -- Upcoming matches (today)
  ('Premier League', 'Chelsea', 'Liverpool', null, null, now() + interval '3 hours', 'upcoming', '{"home": 2.50, "draw": 3.20, "away": 2.90}'),
  ('Ligue 1', 'PSG', 'Marseille', null, null, now() + interval '4 hours', 'upcoming', '{"home": 1.40, "draw": 4.50, "away": 7.50}'),
  
  -- Upcoming matches (tomorrow)
  ('Premier League', 'Manchester City', 'Tottenham', null, null, now() + interval '1 day', 'upcoming', '{"home": 1.70, "draw": 3.80, "away": 5.00}'),
  ('Serie A', 'AC Milan', 'Roma', null, null, now() + interval '1 day 2 hours', 'upcoming', '{"home": 2.20, "draw": 3.30, "away": 3.20}'),
  ('La Liga', 'Atletico Madrid', 'Sevilla', null, null, now() + interval '1 day 3 hours', 'upcoming', '{"home": 1.90, "draw": 3.40, "away": 4.20}'),
  
  -- Upcoming matches (2 days later)
  ('Bundesliga', 'RB Leipzig', 'Bayer Leverkusen', null, null, now() + interval '2 days', 'upcoming', '{"home": 2.10, "draw": 3.30, "away": 3.50}'),
  ('Ligue 1', 'Lyon', 'Monaco', null, null, now() + interval '2 days 2 hours', 'upcoming', '{"home": 2.30, "draw": 3.20, "away": 3.10}'),
  ('Premier League', 'Newcastle', 'Aston Villa', null, null, now() + interval '2 days 4 hours', 'upcoming', '{"home": 1.95, "draw": 3.30, "away": 4.00}'),
  
  -- Upcoming matches (3 days later)
  ('Serie A', 'Napoli', 'Lazio', null, null, now() + interval '3 days', 'upcoming', '{"home": 2.00, "draw": 3.30, "away": 3.80}'),
  ('La Liga', 'Valencia', 'Villarreal', null, null, now() + interval '3 days 3 hours', 'upcoming', '{"home": 2.40, "draw": 3.10, "away": 3.00}'),
  ('Bundesliga', 'Eintracht Frankfurt', 'Hoffenheim', null, null, now() + interval '3 days 4 hours', 'upcoming', '{"home": 2.10, "draw": 3.40, "away": 3.40}');