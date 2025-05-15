import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ArrowRight, Search, FolderRoot as Football } from 'lucide-react';
import { supabase, signOut } from '../../lib/supabase';

interface NavbarProps {
  user: any | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-[#2C4B33] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Football size={24} />
              <span>OddsShift</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1 px-3 pr-8 rounded bg-[#3D5C44] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search size={16} />
              </button>
            </form>
            <Link 
              to="/" 
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
            >
              Live Matches
            </Link>
            <Link 
              to="/upcoming" 
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
            >
              Upcoming
            </Link>
            <a 
              href="https://oddsshift.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200 flex items-center"
            >
              Bet Converter
              <ArrowRight size={16} className="ml-1" />
            </a>
            
            {user ? (
              <>
                <Link 
                  to="/my-teams" 
                  className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
                >
                  My Teams
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200 flex items-center"
                >
                  Sign Out
                  <LogOut size={16} className="ml-1" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 px-3 rounded bg-green-700 hover:bg-green-800 transition duration-200 flex items-center"
              >
                Sign In
                <User size={16} className="ml-1" />
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-[#3D5C44] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2C4B33] border-t border-[#3D5C44] pb-4 px-4">
          <form onSubmit={handleSearch} className="relative mt-4 mb-3">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 pr-8 rounded bg-[#3D5C44] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search size={16} />
            </button>
          </form>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Live Matches
            </Link>
            <Link 
              to="/upcoming" 
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Upcoming
            </Link>
            <a 
              href="https://oddsshift.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Bet Converter
              <ArrowRight size={16} className="ml-1" />
            </a>
            
            {user ? (
              <>
                <Link 
                  to="/my-teams" 
                  className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Teams
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="py-2 px-3 rounded hover:bg-[#3D5C44] transition duration-200 flex items-center justify-between w-full"
                >
                  <span>Sign Out</span>
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="py-2 px-3 rounded bg-green-700 hover:bg-green-800 transition duration-200 flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Sign In</span>
                <User size={16} className="ml-1" />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;