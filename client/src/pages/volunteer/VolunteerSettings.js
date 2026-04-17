import React, { useState } from 'react';
import { User, Mail, Lock, BookOpen, Bell, LogOut, Save, Shield, Eye, EyeOff } from 'lucide-react';

const VolunteerSettings = () => {
  const userName = localStorage.getItem('userName') || 'Volunteer';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
    bio: '',
    skills: localStorage.getItem('userSkills') ? JSON.parse(localStorage.getItem('userSkills')).join(', ') : '',
    availability: 'Flexible',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifs: true,
    opportunityAlerts: true,
    weeklyDigest: false,
    ngoUpdates: true,
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', profile.name);
    if (profile.skills) {
      localStorage.setItem('userSkills', JSON.stringify(profile.skills.split(',').map(s => s.trim())));
    }
    setSaveSuccess('profile');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    setPasswords({ current: '', newPass: '', confirm: '' });
    setSaveSuccess('password');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-black text-volconn-navy mb-8">Settings</h3>

      {/* Profile Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-volconn-blue p-2 rounded-xl">
            <User size={20} className="text-volconn-accent" />
          </div>
          <h4 className="text-lg font-black text-volconn-navy">Profile Information</h4>
          {saveSuccess === 'profile' && (
            <span className="ml-auto text-sm font-bold text-green-500 animate-pulse">✓ Saved!</span>
          )}
        </div>
        
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative mt-1">
                <User size={16} className="absolute left-3 top-3.5 text-slate-300" />
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-3.5 text-slate-300" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills</label>
            <div className="relative mt-1">
              <BookOpen size={16} className="absolute left-3 top-3.5 text-slate-300" />
              <input
                value={profile.skills}
                onChange={(e) => setProfile({...profile, skills: e.target.value})}
                placeholder="React, Python, Design (comma separated)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell NGOs about yourself..."
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 h-24 font-medium mt-1"
            />
          </div>

          <button type="submit" className="flex items-center gap-2 bg-volconn-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-volconn-accent transition-all shadow-md">
            <Save size={16} /> Save Profile
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-50 p-2 rounded-xl">
            <Shield size={20} className="text-volconn-gold" />
          </div>
          <h4 className="text-lg font-black text-volconn-navy">Change Password</h4>
          {saveSuccess === 'password' && (
            <span className="ml-auto text-sm font-bold text-green-500 animate-pulse">✓ Updated!</span>
          )}
        </div>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-3 top-3.5 text-slate-300" />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
              />
              <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-3.5 text-slate-300 hover:text-slate-500">
                {showCurrentPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-3.5 text-slate-300" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-3.5 text-slate-300 hover:text-slate-500">
                  {showNewPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-3.5 text-slate-300" />
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-volconn-navy text-white px-6 py-3 rounded-2xl font-bold hover:bg-volconn-accent transition-all shadow-md">
            <Lock size={16} /> Update Password
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-50 p-2 rounded-xl">
            <Bell size={20} className="text-green-500" />
          </div>
          <h4 className="text-lg font-black text-volconn-navy">Notifications</h4>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'opportunityAlerts', label: 'Opportunity Alerts', desc: 'Get notified about new opportunities' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of weekly activity' },
            { key: 'ngoUpdates', label: 'NGO Updates', desc: 'Updates from connected NGOs' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-volconn-navy text-sm">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                className={`relative w-12 h-7 rounded-full transition-colors ${notifications[item.key] ? 'bg-volconn-accent' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${notifications[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-red-100 p-6 md:p-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600 font-bold transition-colors w-full justify-center py-2"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default VolunteerSettings;
