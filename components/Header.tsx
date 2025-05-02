// components/Header.tsx
import React from 'react';
import LogoutButton from './LogoutButton';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fa fa-comment text-primary text-xl" />
          <span className="font-bold text-lg">NextChat</span>
        </div>
        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;