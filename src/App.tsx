import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import UpcomingPage from './pages/UpcomingPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyTeamsPage from './pages/MyTeamsPage';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth state
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    fetchCurrentUser();

    // Set up listener for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#2C4B33]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/upcoming" element={<UpcomingPage user={user} />} />
          <Route path="/search" element={<SearchPage user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/my-teams" element={<MyTeamsPage user={user} />} />
        </Routes>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;