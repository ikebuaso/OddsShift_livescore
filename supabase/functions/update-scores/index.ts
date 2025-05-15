// This is an example Supabase Edge Function to update scores
// It would be triggered on a schedule or externally

import { createClient } from 'npm:@supabase/supabase-js';

// Initialize Supabase client with service role for admin access
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Sample API for football data - replace with actual API integration
async function fetchLiveScores() {
  // This would typically be an API call to a football data provider
  // For demo purposes, we'll just return mock data
  return [
    { 
      match_id: '123', 
      home_team: 'Arsenal', 
      away_team: 'Manchester United',
      score_home: 2,
      score_away: 1
    },
    { 
      match_id: '456', 
      home_team: 'Barcelona', 
      away_team: 'Real Madrid',
      score_home: 1,
      score_away: 1
    }
  ];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Fetch live scores from external API
    const liveScores = await fetchLiveScores();
    
    // 2. Update scores in Supabase
    for (const match of liveScores) {
      // Find match in database by team names
      const { data: matchData, error: matchError } = await supabaseAdmin
        .from('matches')
        .select('id')
        .eq('home_team', match.home_team)
        .eq('away_team', match.away_team)
        .eq('status', 'live')
        .single();
      
      if (matchError || !matchData) {
        console.error('Error finding match:', matchError);
        continue;
      }
      
      // Update score
      const { error: updateError } = await supabaseAdmin
        .from('matches')
        .update({
          score_home: match.score_home,
          score_away: match.score_away
        })
        .eq('id', matchData.id);
      
      if (updateError) {
        console.error('Error updating match:', updateError);
      }
      
      // Create notifications for users who have these teams as favorites
      if (match.score_home > 0 || match.score_away > 0) {
        // Get users who have either team as a favorite
        const { data: favoriteUsers, error: favError } = await supabaseAdmin
          .from('favorites')
          .select('user_id, team_name')
          .or(`team_name.eq.${match.home_team},team_name.eq.${match.away_team}`);
        
        if (!favError && favoriteUsers && favoriteUsers.length > 0) {
          // Create goal notifications
          const notifications = favoriteUsers.map(fav => ({
            user_id: fav.user_id,
            match_id: matchData.id,
            type: 'goal',
            read: false
          }));
          
          await supabaseAdmin
            .from('notifications')
            .insert(notifications);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, updated: liveScores.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating scores:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});