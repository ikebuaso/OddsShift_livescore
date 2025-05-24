import React from 'react';
import { Link } from 'react-router-dom';
import { Percent as Soccer, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Navbar() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Soccer className="w-8 h-8" />
            <span className="text-xl font-bold">OddsShift</span>
          </Link>

          <div className="flex items-center space-x-4">
            <a
              href="https://oddsshift.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200"
            >
              Bet Converter
            </a>
            
            {user ? (
              <Link to="/my-teams" className="hover:text-gray-200">
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;