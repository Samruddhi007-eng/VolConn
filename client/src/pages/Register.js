import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // This uses the Axios utility we created
import { User, Mail, Lock, BookOpen, Building2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
    skills: '',
    organizationName: '',
    mission: ''
  });

  const { name, email, password, role, skills, organizationName, mission } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split skills string into an array for the backend
      const skillArray = skills.split(',').map(s => s.trim());
      
      const res = await api.post('/auth/register', {
        ...formData,
        skills: role === 'volunteer' ? skillArray : []
      });

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userRole', res.data.user.role);
      if (role === 'volunteer' && skillArray.length) {
        localStorage.setItem('userSkills', JSON.stringify(skillArray));
      }
      
      // Redirect based on role
      if (res.data.user.role === 'volunteer') navigate('/volunteer-dashboard');
      else navigate('/ngo-dashboard');
      
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-volconn-blue flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border-t-8 border-volconn-gold">
        <h2 className="text-3xl font-black text-volconn-navy text-center mb-2">Join Volconn</h2>
        <p className="text-center text-gray-400 mb-8">Empowering Change through Skills</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'volunteer'})}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${role === 'volunteer' ? 'bg-volconn-accent text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'ngo'})}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${role === 'ngo' ? 'bg-volconn-accent text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              NGO
            </button>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 text-volconn-gold" size={20} />
            <input name="name" value={name} onChange={onChange} placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-volconn-gold" size={20} />
            <input name="email" type="email" value={email} onChange={onChange} placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-volconn-gold" size={20} />
            <input name="password" type="password" value={password} onChange={onChange} placeholder="Password" required className="w-full pl-10 pr-4 py-3 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none" />
          </div>

          {/* Conditional Fields for Volunteer */}
          {role === 'volunteer' && (
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-volconn-gold" size={20} />
              <input name="skills" value={skills} onChange={onChange} placeholder="Skills (e.g. React, Python, Design)" className="w-full pl-10 pr-4 py-3 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none" />
            </div>
          )}

          {/* Conditional Fields for NGO */}
          {role === 'ngo' && (
            <>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-volconn-gold" size={20} />
                <input name="organizationName" value={organizationName} onChange={onChange} placeholder="Organization Name" className="w-full pl-10 pr-4 py-3 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none" />
              </div>
              <textarea name="mission" value={mission} onChange={onChange} placeholder="Our Mission..." className="w-full p-4 border-2 border-blue-50 rounded-xl focus:border-volconn-accent outline-none h-24" />
            </>
          )}

          <button type="submit" className="w-full bg-volconn-navy text-white py-4 rounded-2xl font-black text-lg hover:bg-opacity-90 transition-all shadow-lg mt-4">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;