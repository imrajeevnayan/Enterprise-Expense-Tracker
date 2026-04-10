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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background transition-colors duration-500 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[0%] left-[-5%] w-[30%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-5xl w-full flex overflow-hidden shadow-2xl z-10"
      >
        {/* Left Visual Panel */}
        <div className="hidden lg:flex flex-1 p-20 bg-gradient-to-br from-primary via-primary/80 to-accent relative overflow-hidden flex-col justify-between items-start text-left">
          <Link to="/" className="z-10 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group">
            <div className="p-2 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-wide">BACK TO HOME</span>
          </Link>
          
          <div className="relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-6xl font-black mb-6 text-primary-foreground leading-tight tracking-tighter">
                Start Your<br/>
                <span className="text-white/80">Journey.</span>
              </h1>
              <p className="text-lg text-primary-foreground/70 mb-10 max-w-xs font-medium leading-relaxed">
                Take the first step towards financial freedom. Simple, elegant, and powerful tools at your fingertips.
              </p>
            </motion.div>
          </div>

          <div className="z-10 text-primary-foreground/40 text-[10px] font-black tracking-[0.3em] uppercase">
            &copy; 2026 EXPANSE TRACKER
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-20 right-20 w-64 h-64 border border-white rounded-full translate-x-1/2" />
             <div className="absolute bottom-20 left-20 w-64 h-64 border border-white rounded-full -translate-x-1/2" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 bg-card p-12 lg:p-14 flex flex-col justify-center relative">
          <div className="max-w-sm mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-black text-foreground mb-1 tracking-tight">Create Account</h2>
              <p className="text-muted mb-10 font-medium">Join us and start tracking today.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-muted uppercase tracking-widest px-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-secondary border border-border rounded-xl px-5 h-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-muted uppercase tracking-widest px-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-secondary border border-border rounded-xl px-5 h-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-muted uppercase tracking-widest px-1 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-secondary border border-border rounded-xl px-5 h-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
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
                    className="btn-primary w-full h-14 flex items-center justify-center gap-3 font-bold text-lg"
                  >
                    {loading ? (
                       <div className="w-6 h-6 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign Up Free <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center">
                <p className="text-muted font-bold text-sm">
                  Already a member? <Link to="/login" className="text-primary hover:text-accent transition-colors ml-1">Log in</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
