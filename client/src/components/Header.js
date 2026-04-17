import React from 'react';

const Header = ({ title, userName, children }) => {
  return (
    <header className="bg-white border-b p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10">
      <h2 className="text-lg md:text-xl font-black text-volconn-navy uppercase tracking-tight pl-12 md:pl-0">
        {title}
      </h2>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {children}
        {userName && (
          <div className="flex items-center gap-3 bg-volconn-blue/30 px-4 py-2 rounded-2xl">
            <span className="font-bold text-volconn-navy text-sm hidden sm:inline">{userName}</span>
            <div className="w-10 h-10 bg-volconn-gold rounded-full flex items-center justify-center font-black text-volconn-navy shadow-sm">
              {userName.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
