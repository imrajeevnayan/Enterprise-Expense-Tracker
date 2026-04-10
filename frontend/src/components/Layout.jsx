import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex bg-background min-h-screen selection:bg-primary/30 text-foreground transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen relative overflow-x-hidden">
        {/* Abstract Background Elements - Subtle and Theme-Aware */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] left-[-5%] w-[30%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ 
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
