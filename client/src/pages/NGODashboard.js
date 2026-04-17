import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, Briefcase, ClipboardList, X, Mail } from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';
import NGORequirements from './ngo/NGORequirements';
import NGOInbox from './ngo/NGOInbox';
import NGOSettings from './ngo/NGOSettings';

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [ngoName, setNgoName] = useState("NGO");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', requiredSkills: '' });
  const [loading, setLoading] = useState(true);

  // Stats modal state
  const [statsModal, setStatsModal] = useState({ open: false, type: '' });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setNgoName(storedName);
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchData();
  }, [activeTab]);

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
      setShowCreateModal(false);
      setFormData({ title: '', description: '', requiredSkills: '' });
      fetchData();
    } catch (err) {
      alert("Error saving post. Check backend connection.");
    }
  };

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Organization Console';
      case 'requirements': return 'My Requirements';
      case 'inbox': return 'Inbox';
      case 'settings': return 'NGO Profile';
      default: return 'Dashboard';
    }
  };

  // Stats modal content
  const renderStatsModalContent = () => {
    switch(statsModal.type) {
      case 'volunteers':
        const assignedPosts = posts.filter(p => p.assignedVolunteer);
        return (
          <div className="space-y-3 mt-4">
            {assignedPosts.length > 0 ? assignedPosts.map(post => (
              <div key={post._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-volconn-accent rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                  {post.assignedVolunteer?.name ? post.assignedVolunteer.name.charAt(0) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-volconn-navy text-sm truncate">{post.assignedVolunteer?.name || 'Volunteer'}</p>
                  {post.assignedVolunteer?.email && (
                    <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10}/> {post.assignedVolunteer.email}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-volconn-accent">{post.title.split(' - ')[0]}</p>
                  <span className="text-[10px] font-black text-green-500 uppercase">Active</span>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 font-bold py-8 italic">No volunteers assigned yet</p>
            )}
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-3 mt-4">
            {posts.map(post => (
              <div key={post._id} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-bold text-volconn-navy text-sm truncate flex-1">{post.title}</h5>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ml-2 flex-shrink-0 ${
                    post.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-1">
                  {post.requiredSkills?.map(s => (
                    <span key={s} className="bg-volconn-blue/40 text-volconn-accent px-2 py-0.5 rounded text-[10px] font-bold uppercase">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'open':
        const openPosts = posts.filter(p => p.status === 'open');
        return (
          <div className="space-y-3 mt-4">
            {openPosts.length > 0 ? openPosts.map(post => (
              <div key={post._id} className="p-4 bg-slate-50 rounded-2xl">
                <h5 className="font-bold text-volconn-navy text-sm mb-1">{post.title}</h5>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-1">
                  {post.requiredSkills?.map(s => (
                    <span key={s} className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{s}</span>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 font-bold py-8 italic">All positions are filled!</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'requirements':
        return <NGORequirements />;
      case 'inbox':
        return <NGOInbox />;
      case 'settings':
        return <NGOSettings />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        <StatsCard
          icon={<Users className="text-volconn-accent"/>}
          count={posts.filter(p => p.assignedVolunteer).length}
          label="Assigned Volunteers"
          color="border-volconn-accent"
          onClick={() => setStatsModal({ open: true, type: 'volunteers' })}
        />
        <StatsCard
          icon={<Briefcase className="text-volconn-gold"/>}
          count={posts.length}
          label="Total Requirements"
          color="border-volconn-gold"
          onClick={() => setStatsModal({ open: true, type: 'requirements' })}
        />
        <StatsCard
          icon={<ClipboardList className="text-green-500"/>}
          count={posts.filter(p => p.status === 'open').length}
          label="Open Positions"
          color="border-green-500"
          onClick={() => setStatsModal({ open: true, type: 'open' })}
        />
      </div>

      {/* Requirement List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
        <h3 className="text-2xl font-black text-volconn-navy mb-8 italic underline decoration-volconn-gold decoration-4">Live Requirements</h3>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold">Loading requirements...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="group p-6 rounded-3xl border-2 border-slate-50 hover:border-volconn-blue transition-all bg-white hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[200px] md:min-w-[220px]">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Volunteer</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                        {post.assignedVolunteer ? post.assignedVolunteer.name?.charAt(0) || '?' : "?"}
                      </div>
                      <p className="font-bold text-volconn-navy text-sm">
                        {post.assignedVolunteer ? post.assignedVolunteer.name || 'Assigned' : "Waiting for match..."}
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
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar role="ngo" activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <Header title={getHeaderTitle()} userName={ngoName}>
          {activeTab === 'overview' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-volconn-navy text-white px-5 py-2 rounded-xl font-bold hover:bg-volconn-accent transition-all flex items-center gap-2 text-sm shadow-md"
            >
              <PlusCircle size={18}/> New Requirement
            </button>
          )}
        </Header>

        {renderContent()}

        <Footer variant="ngo" />
      </main>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Post a Requirement"
        subtitle="Find the perfect volunteer for your mission."
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
            <input
              required
              placeholder="e.g. Graphic Designer for Social Media"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
            <textarea
              required
              placeholder="Briefly describe the tasks..."
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold h-32 border border-slate-100"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Required Skills</label>
            <input
              required
              placeholder="React, Figma, Writing (comma separated)"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-volconn-navy text-white py-4 rounded-2xl font-black shadow-lg hover:bg-volconn-accent transition-all mt-4">
            Publish Requirement
          </button>
        </form>
      </Modal>

      {/* Stats Detail Modal */}
      <Modal
        isOpen={statsModal.open}
        onClose={() => setStatsModal({ open: false, type: '' })}
        title={
          statsModal.type === 'volunteers' ? 'Assigned Volunteers' :
          statsModal.type === 'requirements' ? 'All Requirements' :
          statsModal.type === 'open' ? 'Open Positions' : ''
        }
        subtitle={
          statsModal.type === 'volunteers' ? 'Volunteers currently working with your organization' :
          statsModal.type === 'requirements' ? 'Complete list of all your posted requirements' :
          statsModal.type === 'open' ? 'Positions still waiting for volunteer applications' : ''
        }
        maxWidth="max-w-lg"
      >
        {renderStatsModalContent()}
      </Modal>
    </div>
  );
};

export default NGODashboard;