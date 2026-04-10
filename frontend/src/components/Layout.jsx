import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex bg-[#0f172a] min-h-screen selection:bg-indigo-500/30">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen relative">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] left-[-5%] w-[30%] h-[40%] bg-fuchsia-500/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ 
                duration: 0.4,
                ease: "circOut"
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
