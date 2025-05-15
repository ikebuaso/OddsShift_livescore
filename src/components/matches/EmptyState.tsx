import React from 'react';
import { Calendar, Search, AlertCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'matches' | 'favorites' | 'search' | 'error';
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, message }) => {
  let icon;
  let title;
  let description = message;

  switch (type) {
    case 'matches':
      icon = <Calendar size={48} className="text-gray-400" />;
      title = "No matches available";
      description = description || "There are currently no matches to display. Please check back later.";
      break;
    case 'favorites':
      icon = <Star size={48} className="text-gray-400" />;
      title = "No favorite teams";
      description = description || "You haven't added any favorite teams yet. Add teams to your favorites to see them here.";
      break;
    case 'search':
      icon = <Search size={48} className="text-gray-400" />;
      title = "No results found";
      description = description || "We couldn't find any matches that match your search. Try a different search term.";
      break;
    case 'error':
      icon = <AlertCircle size={48} className="text-red-500" />;
      title = "Something went wrong";
      description = description || "An error occurred while fetching data. Please try again later.";
      break;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">{description}</p>
      
      {type === 'favorites' && (
        <Link
          to="/"
          className="mt-4 px-4 py-2 rounded-md bg-[#2C4B33] text-white hover:bg-[#3D5C44] transition duration-200"
        >
          Browse Matches
        </Link>
      )}
      
      {type === 'search' && (
        <Link
          to="/"
          className="mt-4 px-4 py-2 rounded-md bg-[#2C4B33] text-white hover:bg-[#3D5C44] transition duration-200"
        >
          View All Matches
        </Link>
      )}
      
      {type === 'error' && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-md bg-[#2C4B33] text-white hover:bg-[#3D5C44] transition duration-200"
        >
          Refresh Page
        </button>
      )}
    </div>
  );
};

export default EmptyState;