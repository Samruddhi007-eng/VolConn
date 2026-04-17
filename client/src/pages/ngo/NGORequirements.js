import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Briefcase, CheckCircle, Filter, Search } from 'lucide-react';
import api from '../../utils/api';

const COLORS = ['#3B82F6', '#FBBF24', '#10B981', '#8B5CF6', '#F43F5E', '#06B6D4', '#F97316', '#6366F1'];

const NGORequirements = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/my-posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch requirements");
    }
    setLoading(false);
  };

  // Analytics
  const totalVolunteers = posts.filter(p => p.assignedVolunteer).length;
  const activeVolunteers = posts.filter(p => p.status === 'filled' && p.assignedVolunteer).length;
  const openPosts = posts.filter(p => p.status === 'open').length;
  const filledPosts = posts.filter(p => p.status === 'filled').length;

  // Pie chart: status distribution
  const statusData = [
    { name: 'Open', value: openPosts },
    { name: 'Filled', value: filledPosts },
  ].filter(d => d.value > 0);

  // Bar chart: skills distribution
  const skillCount = {};
  posts.forEach(p => {
    p.requiredSkills?.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  const skillBarData = Object.entries(skillCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Line chart: posts created over time
  const timelineMap = {};
  posts.forEach(p => {
    const date = new Date(p.createdAt);
    const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    timelineMap[key] = (timelineMap[key] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap).map(([month, count]) => ({ month, volunteers: count }));

  // Filtered posts for the list
  const filteredPosts = useMemo(() => {
    if (!filterQuery) return posts;
    const q = filterQuery.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }, [posts, filterQuery]);

  // Group by title for progress bars
  const titleGroups = {};
  posts.forEach(p => {
    const baseTitle = p.title.split(' - ')[0] || p.title;
    if (!titleGroups[baseTitle]) {
      titleGroups[baseTitle] = { total: 0, filled: 0 };
    }
    titleGroups[baseTitle].total++;
    if (p.status === 'filled') titleGroups[baseTitle].filled++;
  });
  const progressData = Object.entries(titleGroups).map(([title, data]) => ({
    title,
    ...data,
    percent: Math.round((data.filled / data.total) * 100)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-volconn-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-volconn-navy via-blue-800 to-volconn-accent rounded-[2rem] p-8 md:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black mb-2">Requirements Analytics</h3>
          <p className="text-blue-200 max-w-lg">Understand your volunteer pipeline, track requirement fulfillment, and optimize your project distribution.</p>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10">
          <TrendingUp size={200} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border-b-4 border-volconn-accent text-center">
          <Users size={20} className="text-volconn-accent mx-auto mb-2" />
          <p className="text-2xl font-black text-volconn-navy">{totalVolunteers}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volunteers</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border-b-4 border-green-500 text-center">
          <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-volconn-navy">{activeVolunteers}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border-b-4 border-volconn-gold text-center">
          <Briefcase size={20} className="text-volconn-gold mx-auto mb-2" />
          <p className="text-2xl font-black text-volconn-navy">{filledPosts}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border-b-4 border-blue-400 text-center">
          <TrendingUp size={20} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-volconn-navy">{openPosts}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart: Volunteer Status */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black text-volconn-navy mb-6">Position Status</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={statusData} 
                cx="50%" cy="50%" 
                innerRadius={60} outerRadius={100} 
                paddingAngle={5} dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={index === 0 ? '#3B82F6' : '#10B981'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph: Skills distribution */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black text-volconn-navy mb-6">Skills Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={skillBarData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#FBBF24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Growth over time */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
        <h4 className="text-lg font-black text-volconn-navy mb-6">Volunteer Growth Over Time</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="volunteers" stroke="#3B82F6" strokeWidth={3} 
              dot={{ fill: '#0C4A6E', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Requirement Fulfillment Progress */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h4 className="text-lg font-black text-volconn-navy">Requirement Fulfillment</h4>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-300" />
            <input 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by project..."
              className="pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 text-sm font-medium w-full sm:w-64"
            />
          </div>
        </div>
        <div className="space-y-4">
          {progressData.map(item => (
            <div key={item.title} className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-volconn-navy text-sm">{item.title}</p>
                <span className="text-xs font-black text-slate-400">{item.filled}/{item.total} filled</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.percent === 100 ? 'bg-green-500' : 
                    item.percent >= 50 ? 'bg-volconn-accent' : 'bg-volconn-gold'
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGORequirements;
