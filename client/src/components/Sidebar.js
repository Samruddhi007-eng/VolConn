import React, { useState } from 'react';
import { 
  LayoutDashboard, Globe, History, Settings, 
  ClipboardList, MessageSquare, Menu, X 
} from 'lucide-react';

const volunteerTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
  { key: 'explore', label: 'Explore NGOs', icon: <Globe size={20}/> },
  { key: 'activity', label: 'My Activity', icon: <History size={20}/> },
  { key: 'settings', label: 'Settings', icon: <Settings size={20}/> },
];

const ngoTabs = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={20}/> },
  { key: 'requirements', label: 'My Requirements', icon: <ClipboardList size={20}/> },
  { key: 'inbox', label: 'Inbox', icon: <MessageSquare size={20}/> },
  { key: 'settings', label: 'NGO Profile', icon: <Settings size={20}/> },
];

const Sidebar = ({ role, activeTab, onTabChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const tabs = role === 'volunteer' ? volunteerTabs : ngoTabs;

  const handleTabClick = (key) => {
    onTabChange(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-volconn-navy text-white p-2 rounded-xl shadow-lg"
      >
        <Menu size={22}/>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen z-50 md:z-auto
        w-64 bg-volconn-navy text-white flex flex-col shadow-2xl
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black italic text-volconn-gold tracking-tighter">VOLCONN</h1>
            {role === 'ngo' && (
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">NGO Portal</p>
            )}
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20}/>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {tabs.map(tab => (
            <div
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all font-bold ${
                activeTab === tab.key 
                  ? 'bg-volconn-gold text-volconn-navy shadow-lg shadow-volconn-gold/20' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Connected
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
