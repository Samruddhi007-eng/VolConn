import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OpportunityCard from '../components/OpportunityCard';
import VolunteerActivity from './volunteer/VolunteerActivity';
import ExploreNGO from './volunteer/ExploreNGO';
import VolunteerSettings from './volunteer/VolunteerSettings';

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [opportunities, setOpportunities] = useState([]);
  const [user, setUser] = useState({ name: 'Volunteer', skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchOpportunities();
    }
  }, [activeTab]);

  const fetchUserData = () => {
    const name = localStorage.getItem('userName') || "Volunteer";
    const storedSkills = localStorage.getItem('userSkills');
    let skills = ["React", "UI Design"];
    if (storedSkills) {
      try { skills = JSON.parse(storedSkills); } catch(e) {}
    }
    setUser({ name, skills });
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/matched');
      setOpportunities(res.data);
    } catch (err) {
      // Fallback to all if matched fails
      try {
        const res = await api.get('/posts/all');
        setOpportunities(res.data);
      } catch(e) {
        console.error("Fetch failed");
      }
    }
    setLoading(false);
  };

  const handleApply = async (postId) => {
    try {
      await api.put(`/posts/apply/${postId}`);
      alert("🚀 Application Sent! The NGO has been notified.");
      fetchOpportunities();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to apply.");
    }
  };

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Recommended for You';
      case 'explore': return 'Explore NGOs';
      case 'activity': return 'My Activity';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'explore':
        return <ExploreNGO />;
      case 'activity':
        return <VolunteerActivity />;
      case 'settings':
        return <VolunteerSettings />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-volconn-navy to-volconn-accent rounded-[2rem] p-8 md:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black mb-2">Hello, {user.name.split(' ')[0]}! 👋</h3>
          <p className="text-blue-100 max-w-md">You have {opportunities.length} opportunities waiting for your specific skills today.</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <UserCircle size={200} />
        </div>
      </div>

      {/* Dynamic Opportunity Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-slate-400">Scanning the database for matches...</p>
          </div>
        ) : opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <OpportunityCard 
              key={opp._id} 
              opportunity={opp} 
              onApply={handleApply}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="font-bold text-slate-400 italic text-lg">No matches found for your current skill set. Explore other NGOs?</p>
            <button 
              onClick={() => setActiveTab('explore')}
              className="mt-4 px-6 py-3 bg-volconn-navy text-white rounded-2xl font-bold hover:bg-volconn-accent transition-all"
            >
              Explore All NGOs
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="volunteer" activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <Header title={getHeaderTitle()} userName={user.name} />
        
        {renderContent()}

        <Footer variant="volunteer" />
      </main>
    </div>
  );
};

export default VolunteerDashboard;