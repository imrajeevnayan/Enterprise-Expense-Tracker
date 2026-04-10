import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, Palette, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const sections = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" />, active: true },
    { id: 'security', name: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'appearance', name: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'language', name: 'Language', icon: <Globe className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Settings</h1>
          <p className="text-slate-400 text-lg">Personalize your experience and manage account security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-3 px-8 shadow-indigo-500/20 shadow-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map(s => (
            <button 
              key={s.id}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm tracking-tight uppercase ${
                s.active 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass rounded-[32px] p-10 border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-8">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || 'User'} 
                  className="auth-input h-14" 
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || 'user@example.com'} 
                  className="auth-input h-14 bg-white/5 opacity-50 cursor-not-allowed" 
                  disabled
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Default Currency</label>
                <select className="auth-input h-14 bg-[#1e293b]">
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass rounded-[32px] p-10 border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Account Security</h3>
            <p className="text-slate-500 text-sm mb-8">Manage the security of your account and sessions.</p>
            
            <div className="space-y-4">
              <SecurityOption 
                title="Change Password" 
                desc="Update your account password regularly for better security." 
                button="Update"
              />
              <SecurityOption 
                title="Two-Factor Authentication" 
                desc="Add an extra layer of security to your account." 
                button="Enable"
                active
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SecurityOption({ title, desc, button, active }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-all">
      <div>
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-slate-500 text-sm">{desc}</p>
      </div>
      <button className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
        active 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
      }`}>
        {button}
      </button>
    </div>
  );
}
