import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, Globe, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import api from '../../utils/api';

const SKILL_OPTIONS = [
  "React", "Node.js", "MongoDB", "Python", "Flutter", 
  "Tailwind CSS", "Express", "Firebase", "SQL", "Cloud Computing"
];

const ExploreNGO = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    fetchData();
    // Try to get user skills from what we know
    const storedSkills = localStorage.getItem('userSkills');
    if (storedSkills) {
      try { setUserSkills(JSON.parse(storedSkills)); } catch(e) {}
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/all');
      setOpportunities(res.data);
    } catch (err) {
      console.error("Failed to fetch opportunities");
    }
    setLoading(false);
  };

  // Group by NGO
  const ngoGroups = useMemo(() => {
    const groups = {};
    opportunities.forEach(opp => {
      const key = opp.ngoId || opp.ngoName;
      if (!groups[key]) {
        groups[key] = {
          ngoId: opp.ngoId,
          ngoName: opp.ngoName,
          opportunities: [],
          allSkills: new Set(),
        };
      }
      groups[key].opportunities.push(opp);
      opp.requiredSkills?.forEach(s => groups[key].allSkills.add(s));
    });
    return Object.values(groups).map(g => ({
      ...g,
      allSkills: [...g.allSkills],
      openCount: g.opportunities.filter(o => o.status === 'open').length,
    }));
  }, [opportunities]);

  // Compute skill match score
  const computeMatchScore = (ngoSkills) => {
    if (!userSkills.length || !ngoSkills.length) return 0;
    const overlap = ngoSkills.filter(s => userSkills.includes(s)).length;
    return Math.round((overlap / ngoSkills.length) * 100);
  };

  // Filter
  const filtered = useMemo(() => {
    return ngoGroups.filter(ngo => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = ngo.ngoName.toLowerCase().includes(q);
        const skillMatch = ngo.allSkills.some(s => s.toLowerCase().includes(q));
        const oppMatch = ngo.opportunities.some(o => 
          o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
        );
        if (!nameMatch && !skillMatch && !oppMatch) return false;
      }
      // Skill filter
      if (selectedSkills.length > 0) {
        const hasSkill = selectedSkills.some(s => ngo.allSkills.includes(s));
        if (!hasSkill) return false;
      }
      return true;
    }).sort((a, b) => computeMatchScore(b.allSkills) - computeMatchScore(a.allSkills));
  }, [ngoGroups, searchQuery, selectedSkills, userSkills]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleApply = async (postId) => {
    try {
      await api.put(`/posts/apply/${postId}`);
      alert("🚀 Application Sent! The NGO has been notified.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to apply.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Discovering NGOs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Search NGOs, skills, or opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-volconn-accent focus:bg-white outline-none transition-all font-medium"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              showFilters || selectedSkills.length > 0
                ? 'bg-volconn-accent text-white shadow-lg'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Filter size={18} />
            Filter by Skills
            {selectedSkills.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{selectedSkills.length}</span>
            )}
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Skill Filter Chips */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Skills</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-volconn-navy text-white shadow-md'
                      : 'bg-slate-50 text-slate-500 hover:bg-volconn-blue hover:text-volconn-navy'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-slate-400">
          Showing <span className="text-volconn-navy">{filtered.length}</span> NGOs
        </p>
        {selectedSkills.length > 0 && (
          <button 
            onClick={() => setSelectedSkills([])}
            className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? (
          filtered.map(ngo => {
            const matchScore = computeMatchScore(ngo.allSkills);
            return (
              <div key={ngo.ngoId} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all overflow-hidden">
                {/* NGO Header */}
                <div className="p-6 md:p-8 border-b border-slate-50">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-volconn-navy to-volconn-accent rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {ngo.ngoName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-volconn-navy">{ngo.ngoName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <MapPin size={12} /> Remote
                          </span>
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Briefcase size={12} /> {ngo.openCount} Open Positions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    {userSkills.length > 0 && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm ${
                        matchScore >= 70 ? 'bg-green-50 text-green-600' :
                        matchScore >= 40 ? 'bg-yellow-50 text-yellow-600' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        <Star size={16} />
                        {matchScore}% Match
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ngo.allSkills.map(skill => (
                      <span 
                        key={skill} 
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                          userSkills.includes(skill) 
                            ? 'bg-green-100 text-green-600 ring-1 ring-green-200' 
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {userSkills.includes(skill) && '✓ '}{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Opportunities under this NGO */}
                <div className="p-4 md:p-6 space-y-3">
                  {ngo.opportunities.filter(o => o.status === 'open').slice(0, 3).map(opp => (
                    <div key={opp._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-volconn-blue/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-volconn-navy text-sm truncate">{opp.title}</h5>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{opp.description}</p>
                      </div>
                      <button
                        onClick={() => handleApply(opp._id)}
                        className="px-5 py-2 bg-volconn-navy text-white rounded-xl text-xs font-bold hover:bg-volconn-accent transition-all active:scale-95 shadow-sm flex-shrink-0"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                  {ngo.opportunities.filter(o => o.status === 'open').length > 3 && (
                    <p className="text-center text-xs font-bold text-slate-400 pt-2">
                      +{ngo.opportunities.filter(o => o.status === 'open').length - 3} more positions
                    </p>
                  )}
                  {ngo.openCount === 0 && (
                    <p className="text-center text-sm font-bold text-slate-300 py-4 italic">No open positions currently</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Globe size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-bold text-slate-400 italic text-lg">No NGOs match your search criteria</p>
            <p className="text-sm text-slate-300 mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreNGO;
