import React, { useState, useEffect } from 'react';
import { Search, MapPin, Award, UserCircle, LayoutDashboard, Globe, History, Settings, LogOut, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('matched'); // 'matched' or 'explore'
  const [opportunities, setOpportunities] = useState([]);
  const [user, setUser] = useState({ name: 'Volunteer', skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchOpportunities();
  }, [activeTab]);

  const fetchUserData = () => {
    const name = localStorage.getItem('userName') || "Volunteer";
    // In a real app, you'd fetch the full profile from the DB here
    setUser({ name, skills: ["React", "UI Design"] }); 
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'matched' ? '/posts/matched' : '/posts/all';
      const res = await api.get(endpoint);
      setOpportunities(res.data);
    } catch (err) {
      console.error("Fetch failed");
    }
    setLoading(false);
  };
const handleLogout = () => {
  // Clear everything: token, userName, and role
  localStorage.clear(); 
  // Redirect to the login/home page
  window.location.href = "/"; 
};
const handleApply = async (postId) => {
  try {
    const res = await api.put(`/posts/apply/${postId}`);
    alert("🚀 Application Sent! The NGO has been notified.");
    
    // Refresh the list so the "Apply" button disappears or shows "Applied"
    fetchOpportunities(); 
  } catch (err) {
    alert(err.response?.data?.msg || "Failed to apply.");
  }
};
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-volconn-navy text-white flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-black italic text-volconn-gold tracking-tighter">VOLCONN</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'matched'} onClick={() => setActiveTab('matched')} />
          <SidebarItem icon={<Globe size={20}/>} label="Explore NGOs" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <SidebarItem icon={<History size={20}/>} label="My Activity" />
          <SidebarItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-700">
          <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-volconn-gold transition-colors font-bold">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-black text-volconn-navy uppercase tracking-tight">
            {activeTab === 'matched' ? 'Recommended for You' : 'Browse All Opportunities'}
          </h2>
          <div className="flex items-center gap-4 bg-volconn-blue/30 px-4 py-2 rounded-2xl">
            <span className="font-bold text-volconn-navy">{user.name}</span>
            <div className="w-10 h-10 bg-volconn-gold rounded-full flex items-center justify-center font-black text-volconn-navy">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-volconn-navy to-volconn-accent rounded-[2rem] p-10 text-white mb-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-2">Hello, {user.name.split(' ')[0]}! 👋</h3>
              <p className="text-blue-100 max-w-md">You have {opportunities.length} opportunities waiting for your specific skills today.</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <UserCircle size={200} />
            </div>
          </div>

          {/* Dynamic Opportunity Grid */}
          <div className="grid grid-cols-1 gap-6">
  {loading ? (
    <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Scanning the database for matches...</div>
  ) : opportunities.length > 0 ? (
    opportunities.map((opp) => (
      <div key={opp._id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-volconn-gold transition-all group relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-black text-volconn-accent uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">{opp.ngoName}</span>
            <h4 className="text-2xl font-black text-volconn-navy mt-2 group-hover:text-volconn-accent transition-colors">{opp.title}</h4>
          </div>
          <button className="bg-volconn-gold/10 text-volconn-gold p-3 rounded-2xl group-hover:bg-volconn-gold group-hover:text-white transition-all">
            <ChevronRight />
          </button>
        </div>
        
        <p className="text-slate-500 mb-6 leading-relaxed">{opp.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <MapPin size={18} className="text-volconn-gold" /> Remote
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            <Award size={18} className="text-volconn-gold" /> High Impact
          </div>

          {/* --- NEW APPLY NOW BUTTON --- */}
          <button 
            onClick={() => handleApply(opp._id)}
            disabled={opp.status === 'filled'}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md ${
              opp.status === 'open' 
              ? 'bg-volconn-navy text-white hover:bg-volconn-accent' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {opp.status === 'open' ? 'Apply Now' : 'Position Filled'}
          </button>

          <div className="ml-auto flex gap-2">
            {opp.requiredSkills.map(skill => (
              <span key={skill} className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-md uppercase tracking-tighter">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
      <p className="font-bold text-slate-400 italic text-lg">No matches found for your current skill set. Explore other NGOs?</p>
    </div>
  )}
</div>
        </div>

        {/* --- REAL WORLD FOOTER --- */}
        <footer className="bg-white border-t mt-20 p-12 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-10">
            <div>
              <h5 className="font-black text-volconn-navy mb-4">About Volconn</h5>
              <p className="text-sm text-slate-400">Connecting talent with purpose. We empower NGOs by providing them access to skilled professionals like you.</p>
            </div>
            <div>
              <h5 className="font-black text-volconn-navy mb-4">Quick Links</h5>
              <ul className="text-sm text-slate-500 space-y-2 font-bold">
                <li className="hover:text-volconn-gold cursor-pointer">Privacy Policy</li>
                <li className="hover:text-volconn-gold cursor-pointer">Terms of Service</li>
                <li className="hover:text-volconn-gold cursor-pointer">Support</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-volconn-navy mb-4">Contact</h5>
              <p className="text-sm text-slate-400">support@volconn.com<br/>Mumbai, India</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-300">© 2026 Volconn Platform. Built for Social Impact.</p>
        </footer>
      </main>
    </div>
  );
};

// Helper component for Sidebar Items
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all font-bold ${active ? 'bg-volconn-gold text-volconn-navy shadow-lg shadow-volconn-gold/20' : 'text-slate-400 hover:bg-slate-800'}`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default VolunteerDashboard;