import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Check credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-6 bg-[#0a0f1e]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card max-w-6xl w-full h-[700px] flex shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Left Visual Panel */}
        <div className="auth-visual hidden lg:flex flex-1 p-20 bg-gradient-to-br from-indigo-700 via-violet-800 to-fuchsia-900 relative overflow-hidden flex-col justify-between items-start text-left">
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
                Master Your<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-indigo-300">Fortunes.</span>
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-md font-medium leading-relaxed">
                Join thousands of users who take control of their financial destiny with precision and style.
              </p>
            </motion.div>
            
            <div className="flex gap-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                   {i === 1 && <motion.div animate={{ x: [-48, 48] }} transition={{ repeat: Infinity, duration: 2 }} className="w-full h-full bg-white/60" />}
                 </div>
               ))}
            </div>
          </div>

          <div className="z-10 text-white/40 text-sm font-medium tracking-widest uppercase">
            &copy; 2026 EXPANSE TRACKER PREMIUM
          </div>
          
          {/* Animated Orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-fuchsia-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Right Form Panel */}
        <div className="flex-[1.2] lg:flex-none lg:w-[500px] bg-[#0f172a] p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-sm mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-500 mb-12 font-medium">Log in to your account to continue.</p>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="form-label flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="form-label flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Password
                    </label>
                    <a href="#" className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                   <div className="relative w-5 h-5">
                     <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                     <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                       <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                     </div>
                   </div>
                   <span className="text-sm text-slate-400 font-medium select-none">Stay logged in</span>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-submit flex items-center justify-center gap-3"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      Sign In Now <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 text-center">
                <p className="text-slate-500 font-medium">
                  New here? <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Create account</Link>
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle background text */}
          <div className="absolute top-10 right-10 text-[80px] font-black text-white/[0.02] select-none pointer-events-none uppercase">
            Login
          </div>
        </div>
      </motion.div>
    </div>
  );
}
