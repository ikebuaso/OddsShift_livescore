import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MatchList from './components/MatchList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MyTeams from './components/MyTeams';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MatchList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/my-teams" element={<MyTeams />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;