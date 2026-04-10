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
      className="pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">Settings</h1>
          <p className="text-muted text-lg font-medium">Personalize your experience and manage account security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-3 px-8 shadow-primary/20 shadow-lg active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
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
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted hover:text-foreground hover:bg-secondary border border-transparent'
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card p-8 md:p-10">
            <h3 className="text-2xl font-bold text-foreground mb-8">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-muted uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || 'User'} 
                  className="w-full bg-secondary border border-border rounded-xl px-5 h-14 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-muted uppercase tracking-widest px-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || 'user@example.com'} 
                  className="w-full bg-secondary/50 border border-border rounded-xl px-5 h-14 text-muted cursor-not-allowed font-medium" 
                  disabled
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-black text-muted uppercase tracking-widest px-1">Default Currency</label>
                <select className="w-full bg-secondary border border-border rounded-xl px-5 h-14 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium appearance-none">
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 md:p-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">Account Security</h3>
            <p className="text-muted font-medium text-sm mb-8">Manage the security of your account and sessions.</p>
            
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
    <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30 border border-border group hover:bg-secondary/50 transition-all">
      <div>
        <h4 className="text-foreground font-bold">{title}</h4>
        <p className="text-muted text-sm font-medium">{desc}</p>
      </div>
      <button className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
          : 'bg-background text-muted border border-border hover:text-foreground hover:bg-secondary'
      }`}>
        {button}
      </button>
    </div>
  );
}
