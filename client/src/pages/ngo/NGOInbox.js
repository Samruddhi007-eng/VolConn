import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, BookOpen, Mail, Award, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

const NGOInbox = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'accepted', 'open'
  const [actionFeedback, setActionFeedback] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/my-posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch inbox data");
    }
    setLoading(false);
  };

  // Requests are posts with assigned volunteers (accepted by the system)
  const acceptedRequests = posts.filter(p => p.assignedVolunteer);
  const openPositions = posts.filter(p => !p.assignedVolunteer && p.status === 'open');

  const displayPosts = filter === 'accepted' ? acceptedRequests : 
                       filter === 'open' ? openPositions : 
                       posts;

  const handleAccept = (postId) => {
    setActionFeedback({ ...actionFeedback, [postId]: 'accepted' });
  };

  const handleReject = (postId) => {
    setActionFeedback({ ...actionFeedback, [postId]: 'rejected' });
    // Remove from display after animation
    setTimeout(() => {
      setActionFeedback(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-volconn-navy">Inbox</h3>
          <p className="text-sm text-slate-400 mt-1">Manage volunteer requests and assignments</p>
        </div>
        
        {/* Filter chips */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', count: posts.length },
            { key: 'accepted', label: 'Accepted', count: acceptedRequests.length },
            { key: 'open', label: 'Pending', count: openPositions.length },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f.key 
                  ? 'bg-volconn-navy text-white shadow-md' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {displayPosts.length > 0 ? (
          displayPosts.map(post => {
            const feedback = actionFeedback[post._id];
            const hasVolunteer = post.assignedVolunteer;
            
            return (
              <div 
                key={post._id} 
                className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${
                  feedback === 'rejected' ? 'opacity-30 scale-95' : 'hover:shadow-lg'
                }`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Post info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-black text-volconn-navy truncate">{post.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex-shrink-0 ${
                          post.status === 'open' 
                            ? 'bg-yellow-50 text-yellow-600' 
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {post.status === 'filled' ? 'Assigned' : 'Open'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{post.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.requiredSkills?.map(skill => (
                          <span key={skill} className="bg-volconn-blue/40 text-volconn-accent px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Volunteer info + Actions */}
                    <div className="md:min-w-[280px]">
                      {hasVolunteer ? (
                        <div className="bg-gradient-to-br from-slate-50 to-volconn-blue/20 rounded-2xl p-5 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-3">
                            <UserCheck size={12} /> Volunteer Profile
                          </span>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-volconn-accent rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                              {post.assignedVolunteer.name ? post.assignedVolunteer.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-volconn-navy text-sm">
                                {post.assignedVolunteer.name || 'Volunteer'}
                              </p>
                              {post.assignedVolunteer.email && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Mail size={10} /> {post.assignedVolunteer.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mb-4">
                            <Award size={12} className="text-volconn-gold" />
                            <span className="text-xs font-bold text-slate-500">{post.title.split(' - ')[0]}</span>
                          </div>

                          {/* Accept / Reject Actions */}
                          <div className="flex gap-2">
                            {feedback === 'accepted' ? (
                              <div className="flex items-center gap-2 text-green-500 font-bold text-sm w-full justify-center py-2 bg-green-50 rounded-xl">
                                <CheckCircle size={16} /> Accepted
                              </div>
                            ) : feedback === 'rejected' ? (
                              <div className="flex items-center gap-2 text-red-400 font-bold text-sm w-full justify-center py-2 bg-red-50 rounded-xl">
                                <XCircle size={16} /> Rejected
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleAccept(post._id)}
                                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-all active:scale-95 shadow-sm"
                                >
                                  <CheckCircle size={14} /> Accept
                                </button>
                                <button
                                  onClick={() => handleReject(post._id)}
                                  className="flex-1 flex items-center justify-center gap-2 bg-white text-red-400 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 border border-red-100 transition-all active:scale-95"
                                >
                                  <XCircle size={14} /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
                          <UserX size={24} className="text-slate-200 mx-auto mb-2" />
                          <p className="text-sm text-slate-400 font-bold">Awaiting Applications</p>
                          <p className="text-xs text-slate-300 mt-1">No volunteer has applied yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-bold text-slate-400 italic text-lg">No requests to display</p>
            <p className="text-sm text-slate-300 mt-2">Volunteer requests will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOInbox;
