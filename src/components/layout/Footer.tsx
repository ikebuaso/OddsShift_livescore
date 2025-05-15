import React from 'react';
import { Link } from 'react-router-dom';
import { FolderRoot as Football, Mail, Shield, Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C4B33] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Football size={24} />
              <span>OddsShift</span>
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Live football scores and odds in one place.
              Stay updated with your favorite teams and matches.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Live Matches
                </Link>
              </li>
              <li>
                <Link to="/upcoming" className="text-gray-300 hover:text-white transition">
                  Upcoming Matches
                </Link>
              </li>
              <li>
                <a 
                  href="https://oddsshift.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  Bet Converter
                </a>
              </li>
              <li>
                <Link to="/my-teams" className="text-gray-300 hover:text-white transition">
                  My Teams
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Information</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Info size={16} />
                <Link to="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Shield size={16} />
                <Link to="/privacy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a 
                  href="mailto:info@oddsshift.com" 
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3D5C44] mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} OddsShift. All rights reserved.</p>
          <p className="mt-1">
            Data provided by football data providers. This site is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;