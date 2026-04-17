import React, { useState } from 'react';
import { Building2, Mail, Globe, FileText, Bell, LogOut, Save, Shield, Lock, Eye, EyeOff } from 'lucide-react';

const NGOSettings = () => {
  const userName = localStorage.getItem('userName') || 'NGO Admin';
  const userEmail = localStorage.getItem('userEmail') || '';

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
    organizationName: localStorage.getItem('orgName') || '',
    website: '',
    mission: '',
    domain: 'Technology',
    phone: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifs: true,
    volunteerAlerts: true,
    weeklyReport: true,
    systemUpdates: false,
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', profile.name);
    if (profile.organizationName) localStorage.setItem('orgName', profile.organizationName);
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
      <h3 className="text-2xl md:text-3xl font-black text-volconn-navy mb-8">NGO Profile & Settings</h3>

      {/* Organization Profile */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-volconn-blue p-2 rounded-xl">
            <Building2 size={20} className="text-volconn-accent" />
          </div>
          <h4 className="text-lg font-black text-volconn-navy">Organization Info</h4>
          {saveSuccess === 'profile' && (
            <span className="ml-auto text-sm font-bold text-green-500 animate-pulse">✓ Saved!</span>
          )}
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Name</label>
              <input
                value={profile.organizationName}
                onChange={(e) => setProfile({...profile, organizationName: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain</label>
              <select
                value={profile.domain}
                onChange={(e) => setProfile({...profile, domain: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium mt-1 appearance-none"
              >
                <option>Technology</option>
                <option>Education</option>
                <option>Health</option>
                <option>Environment</option>
                <option>Social Welfare</option>
                <option>Animal Rights</option>
                <option>Disaster Relief</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
              <div className="relative mt-1">
                <Globe size={16} className="absolute left-3 top-3.5 text-slate-300" />
                <input
                  value={profile.website}
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  placeholder="https://www.example.org"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 font-medium mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement</label>
            <div className="relative mt-1">
              <FileText size={16} className="absolute left-3 top-3.5 text-slate-300" />
              <textarea
                value={profile.mission}
                onChange={(e) => setProfile({...profile, mission: e.target.value})}
                placeholder="Describe your organization's mission..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-volconn-gold border border-slate-100 h-24 font-medium"
              />
            </div>
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
            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive important updates via email' },
            { key: 'volunteerAlerts', label: 'Volunteer Alerts', desc: 'Get notified when volunteers apply' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Automated weekly performance summary' },
            { key: 'systemUpdates', label: 'System Updates', desc: 'Platform updates and maintenance alerts' },
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

export default NGOSettings;
