import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Briefcase, Award } from 'lucide-react';
import api from '../../utils/api';

const COLORS = ['#3B82F6', '#FBBF24', '#10B981', '#8B5CF6', '#F43F5E', '#06B6D4', '#F97316', '#6366F1', '#EC4899', '#14B8A6'];

const VolunteerActivity = () => {
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/all');
      // Also fetch matched to get filled ones the user might have applied to
      let allPosts = res.data;
      try {
        const matchedRes = await api.get('/posts/matched');
        // Merge unique posts
        const ids = new Set(allPosts.map(p => p._id));
        matchedRes.data.forEach(p => {
          if (!ids.has(p._id)) allPosts.push(p);
        });
      } catch(e) {}
      setAllOpportunities(allPosts);
    } catch (err) {
      console.error("Failed to fetch activity data");
    }
    setLoading(false);
  };

  // Compute analytics from all opportunities
  const myApplied = allOpportunities.filter(o => 
    o.assignedVolunteer === userId || 
    (o.assignedVolunteer && typeof o.assignedVolunteer === 'object' && o.assignedVolunteer._id === userId)
  );

  const uniqueNGOs = [...new Set(myApplied.map(o => o.ngoId))];
  
  // Category distribution from all opportunities (skill-based)
  const skillCount = {};
  allOpportunities.forEach(o => {
    o.requiredSkills?.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  const categoryData = Object.entries(skillCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // NGOs vs Opportunities bar chart
  const ngoOppMap = {};
  allOpportunities.forEach(o => {
    const name = o.ngoName || 'Unknown';
    ngoOppMap[name] = (ngoOppMap[name] || 0) + 1;
  });
  const ngoBarData = Object.entries(ngoOppMap)
    .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, opportunities: count }))
    .sort((a, b) => b.opportunities - a.opportunities)
    .slice(0, 10);

  // Timeline data (activity over time by month)
  const timelineMap = {};
  allOpportunities.forEach(o => {
    const date = new Date(o.createdAt);
    const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    timelineMap[key] = (timelineMap[key] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap).map(([month, count]) => ({ month, opportunities: count }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Loading activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-volconn-navy via-blue-800 to-volconn-accent rounded-[2rem] p-8 md:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black mb-2">My Activity Overview</h3>
          <p className="text-blue-200 max-w-lg">Track your volunteer journey, see your impact, and discover patterns in your contributions.</p>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10">
          <TrendingUp size={200} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-volconn-accent">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-xl"><Users size={20} className="text-volconn-accent"/></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NGOs Connected</span>
          </div>
          <p className="text-3xl font-black text-volconn-navy">{uniqueNGOs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-volconn-gold">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-50 p-2 rounded-xl"><Briefcase size={20} className="text-volconn-gold"/></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opportunities Applied</span>
          </div>
          <p className="text-3xl font-black text-volconn-navy">{myApplied.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-xl"><Award size={20} className="text-green-500"/></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Categories</span>
          </div>
          <p className="text-3xl font-black text-volconn-navy">{categoryData.length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: NGOs vs Opportunities */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black text-volconn-navy mb-6">NGOs vs Opportunities</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ngoBarData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} 
              />
              <Bar dataKey="opportunities" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Opportunity Categories */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black text-volconn-navy mb-6">Opportunity Categories</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={categoryData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={100} 
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h4 className="text-lg font-black text-volconn-navy mb-6">Activity Timeline</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} 
            />
            <Line 
              type="monotone" 
              dataKey="opportunities" 
              stroke="#FBBF24" 
              strokeWidth={3} 
              dot={{ fill: '#0C4A6E', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#FBBF24', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolunteerActivity;
