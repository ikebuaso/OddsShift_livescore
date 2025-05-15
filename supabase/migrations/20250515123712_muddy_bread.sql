/*
  # Initial Schema Setup for OddsShift

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `league` (text)
      - `home_team` (text)
      - `away_team` (text)
      - `score_home` (integer, nullable)
      - `score_away` (integer, nullable)
      - `start_time` (timestamptz)
      - `status` (enum: 'upcoming', 'live', 'finished')
      - `odds` (jsonb: home, draw, away odds)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `team_name` (text)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `match_id` (uuid, references matches)
      - `type` (enum: 'goal', 'start', 'end', 'upcoming')
      - `read` (boolean, default false)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add RLS policies for secure user access
*/

-- Create enum types
CREATE TYPE match_status AS ENUM ('upcoming', 'live', 'finished');
CREATE TYPE notification_type AS ENUM ('goal', 'start', 'end', 'upcoming');

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  league text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  score_home integer,
  score_away integer,
  start_time timestamptz NOT NULL,
  status match_status NOT NULL DEFAULT 'upcoming',
  odds jsonb NOT NULL DEFAULT '{"home": 1.0, "draw": 1.0, "away": 1.0}'::jsonb
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  UNIQUE(user_id, team_name)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Matches policies
-- Anyone can read matches
CREATE POLICY "Matches are viewable by everyone" 
  ON matches
  FOR SELECT
  USING (true);

-- Favorites policies
-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites" 
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications" 
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);