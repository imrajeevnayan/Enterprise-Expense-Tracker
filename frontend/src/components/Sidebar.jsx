import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/transactions', name: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { path: '/budgets', name: 'Budgets', icon: <PiggyBank className="w-5 h-5" /> },
    { path: '/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 p-8 flex flex-col bg-[#0f172a]/80 backdrop-blur-2xl border-r border-white/5 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center font-black text-white text-2xl border border-white/10">
            E
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            EXPANSE
          </h1>
          <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block group"
          >
            <div className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              location.pathname === item.path 
                ? 'bg-indigo-600/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)] border border-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}>
              <span className={`transition-colors duration-300 ${
                location.pathname === item.path ? 'text-indigo-400' : 'group-hover:text-indigo-400'
              }`}>
                {item.icon}
              </span>
              <span className="font-bold tracking-tight text-sm uppercase">{item.name}</span>
              
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                />
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile Hook */}
      <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm truncate">{user?.name || 'Guest User'}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email || 'premium@expanse.com'}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 border border-rose-500/10"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </div>
  );
}
