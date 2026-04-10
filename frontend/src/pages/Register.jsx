import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || 'Error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-6 bg-[#0a0f1e]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card max-w-6xl w-full h-[750px] flex shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Left Visual Panel - Reused with different content */}
        <div className="auth-visual hidden lg:flex flex-1 p-20 bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900 relative overflow-hidden flex-col justify-between items-start text-left">
          <Link to="/" className="z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-wide">BACK TO HOME</span>
          </Link>
          
          <div className="relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-7xl font-black mb-6 text-white leading-tight tracking-tighter">
                Start Your<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">Journey.</span>
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-md font-medium leading-relaxed">
                Take the first step towards financial freedom. Simple, elegant, and powerful tools at your fingertips.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-1 bg-white/10 rounded-full">
                   {i === 1 && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-teal-400 rounded-full" />}
                 </div>
               ))}
            </div>
          </div>

          <div className="z-10 text-white/40 text-sm font-medium tracking-widest uppercase">
            &copy; 2026 EXPANSE TRACKER PREMIUM
          </div>
          
          {/* Animated Orbs */}
          <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-fuchsia-500/20 rounded-full blur-[110px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-[90px]" />
        </div>

        {/* Right Form Panel */}
        <div className="flex-[1.2] lg:flex-none lg:w-[500px] bg-[#0f172a] p-12 lg:p-14 flex flex-col justify-center relative">
          <div className="max-w-sm mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-500 mb-10 font-medium">Join us and start tracking today.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="form-label flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="form-label flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="form-label flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Strong Password
                  </label>
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-submit flex items-center justify-center gap-3"
                  >
                    {loading ? 'Creating Account...' : (
                      <>
                        Sign Up Free <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 font-medium italic text-sm mb-6">
                  "The best time to start was yesterday. The second best time is now."
                </p>
                <p className="text-slate-500 font-medium">
                  Already a member? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Log in</Link>
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle background text */}
          <div className="absolute top-10 right-10 text-[80px] font-black text-white/[0.02] select-none pointer-events-none uppercase">
            Join
          </div>
        </div>
      </motion.div>
    </div>
  );
}
