import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Users, ClipboardList, Briefcase, X, 
  LayoutDashboard, Settings, LogOut, MessageSquare 
} from 'lucide-react';
import api from '../utils/api';

const NGODashboard = () => {
  // --- STATE ---
  const [posts, setPosts] = useState([]);
  const [ngoName, setNgoName] = useState("NGO");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', requiredSkills: '' });
  const [loading, setLoading] = useState(true);

  // --- LIFECYCLE ---
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setNgoName(storedName);
    fetchData();
  }, []);

  // --- ACTIONS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/my-posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching NGO posts");
    }
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const skillArray = formData.requiredSkills.split(',').map(s => s.trim());
      await api.post('/posts/create', { 
        ...formData, 
        requiredSkills: skillArray,
        ngoName: ngoName 
      });
      setShowModal(false);
      setFormData({ title: '', description: '', requiredSkills: '' }); // Reset form
      fetchData(); // Refresh list
    } catch (err) {
      alert("Error saving post. Check backend connection.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- PROFESSIONAL SIDEBAR --- */}
      <aside className="w-64 bg-volconn-navy text-white flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-black italic text-volconn-gold tracking-tighter">VOLCONN</h1>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">NGO Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={true} />
          <SidebarItem icon={<ClipboardList size={20}/>} label="My Requirements" />
          <SidebarItem icon={<MessageSquare size={20}/>} label="Inboxes" />
          <SidebarItem icon={<Settings size={20}/>} label="NGO Profile" />
        </nav>

        <div className="p-6 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors font-bold w-full"
          >
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-volconn-navy uppercase tracking-tight">Organization Console</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setShowModal(true)}
              className="bg-volconn-navy text-white px-5 py-2 rounded-xl font-bold hover:bg-volconn-accent transition-all flex items-center gap-2 text-sm shadow-md"
            >
              <PlusCircle size={18}/> New Requirement
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-volconn-navy text-sm">{ngoName}</span>
              <div className="w-10 h-10 bg-volconn-gold rounded-full flex items-center justify-center font-black text-volconn-navy shadow-sm">
                {ngoName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatsCard icon={<Users className="text-volconn-accent"/>} count={posts.filter(p => p.assignedVolunteer).length} label="Assigned Volunteers" color="border-volconn-accent" />
            <StatsCard icon={<Briefcase className="text-volconn-gold"/>} count={posts.length} label="Total Requirements" color="border-volconn-gold" />
            <StatsCard icon={<ClipboardList className="text-green-500"/>} count={posts.filter(p => p.status === 'open').length} label="Open Positions" color="border-green-500" />
          </div>

          {/* Requirement List */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-2xl font-black text-volconn-navy mb-8 italic underline decoration-volconn-gold decoration-4">Live Requirements</h3>
            
            <div className="space-y-6">
              {loading ? (
                <p className="text-center text-slate-400 font-bold animate-pulse">Loading requirements...</p>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="group p-6 rounded-3xl border-2 border-slate-50 hover:border-volconn-blue transition-all bg-white hover:shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-volconn-navy">{post.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${post.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{post.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.requiredSkills.map(s => (
                            <span key={s} className="bg-volconn-blue/40 text-volconn-accent px-3 py-1 rounded-lg text-[10px] font-bold uppercase">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[220px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Volunteer</span>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                            {post.assignedVolunteer ? post.assignedVolunteer.name.charAt(0) : "?"}
                          </div>
                          <p className="font-bold text-volconn-navy text-sm">
                            {post.assignedVolunteer ? post.assignedVolunteer.name : "Waiting for match..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold italic">No active needs posted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- REAL WORLD FOOTER --- */}
        <footer className="bg-white border-t mt-20 p-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-10">
            <div>
              <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">About Volconn</h5>
              <p className="text-sm text-slate-400">Streamlining NGO operations by matching mission-driven projects with professional talent.</p>
            </div>
            <div>
              <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">Compliance</h5>
              <ul className="text-sm text-slate-500 space-y-2 font-bold">
                <li className="hover:text-volconn-gold cursor-pointer">NGO Guidelines</li>
                <li className="hover:text-volconn-gold cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-volconn-navy mb-4 uppercase text-xs tracking-widest">Support</h5>
              <p className="text-sm text-slate-400">ngo-help@volconn.com<br/>24/7 Support Line Available</p>
            </div>
          </div>
          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 Volconn Platform • Enterprise Edition</p>
        </footer>
      </main>

      {/* --- POST MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-volconn-navy/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-300 hover:text-red-500 transition-colors"><X/></button>
            <h2 className="text-2xl font-black text-volconn-navy mb-2 tracking-tighter">Post a Requirement</h2>
            <p className="text-slate-400 text-sm mb-6 font-medium">Find the perfect volunteer for your mission.</p>
            
            <form onSubmit={handlePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
                <input 
                  required placeholder="e.g. Graphic Designer for Social Media" 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
                <textarea 
                  required placeholder="Briefly describe the tasks..." 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold h-32 border border-slate-100"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Required Skills</label>
                <input 
                  required placeholder="React, Figma, Writing (comma separated)" 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100"
                  onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-volconn-navy text-white py-4 rounded-2xl font-black shadow-lg hover:bg-volconn-accent transition-all mt-4">
                Publish Requirement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all font-bold ${active ? 'bg-volconn-gold text-volconn-navy shadow-lg shadow-volconn-gold/20' : 'text-slate-400 hover:bg-slate-800'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const StatsCard = ({ icon, count, label, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-4 ${color} flex items-center justify-between group hover:shadow-xl transition-all`}>
    <div>
      <div className="text-3xl font-black text-volconn-navy">{count}</div>
      <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{label}</div>
    </div>
    <div className="bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
  </div>
);

export default NGODashboard;