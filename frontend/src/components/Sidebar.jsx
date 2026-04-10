import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, Settings, LogOut, ChevronRight, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/transactions', name: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { path: '/budgets', name: 'Budgets', icon: <PiggyBank className="w-5 h-5" /> },
    { path: '/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />
  };

  return (
    <div className="w-72 h-screen fixed left-0 top-0 p-8 flex flex-col bg-background/80 backdrop-blur-2xl border-r border-border z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-12 h-12 bg-card rounded-xl flex items-center justify-center font-black text-primary text-2xl border border-border shadow-sm">
            E
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground">
            EXPANSE
          </h1>
          <div className="h-1 w-8 bg-primary rounded-full mt-0.5" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block group"
          >
            <div className={`sidebar-item ${
              location.pathname === item.path 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'text-muted hover:text-foreground hover:bg-secondary'
            }`}>
              <span className={`transition-colors duration-300 ${
                location.pathname === item.path ? 'text-primary-foreground' : 'group-hover:text-primary'
              }`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.name}</span>
              
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground"
                />
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Theme Switcher */}
      <div className="mt-8 mb-8 p-1 bg-secondary rounded-xl flex items-center justify-between">
        {['light', 'system', 'dark'].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${
              theme === t 
                ? 'bg-background text-primary shadow-sm active:scale-95' 
                : 'text-muted hover:text-foreground'
            }`}
            title={`${t.charAt(0).toUpperCase() + t.slice(1)} Mode`}
          >
            {themeIcons[t]}
          </button>
        ))}
      </div>

      {/* User Profile Hook */}
      <div className="mt-auto pt-6 border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-foreground font-bold text-sm truncate leading-tight">{user?.name || 'Guest User'}</p>
            <p className="text-muted text-[10px] uppercase tracking-wider font-semibold truncate leading-tight">{user?.role || 'Premium account'}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all duration-300 border border-rose-500/10 group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
