import React from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${className}`}
  >
    Refresh
  </button>
);

export default RefreshButton;
