import { useState, useEffect } from 'react';
import { budgetService, categoryService } from '../services/api';
import { Plus, Info, AlertTriangle, Target, TrendingUp, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BudgetModal from '../components/BudgetModal';
import toast from 'react-hot-toast';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget? Monitoring will stop for this category.')) {
      try {
        await budgetService.delete(id);
        toast.success('Budget removed');
        fetchBudgets();
      } catch (err) {
        toast.error('Failed to remove budget');
      }
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBudget = async (budgetData) => {
    try {
      await budgetService.create(budgetData);
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving budget');
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data } = await budgetService.getAll(new Date().getMonth() + 1, new Date().getFullYear());
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Budgets</h1>
          <p className="text-slate-400 text-lg">Set monthly spending limits for categories and cultivate discipline.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-3"
        >
          <Target className="w-5 h-5" /> Set New Budget
        </button>
      </div>

      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddBudget}
        categories={categories}
        onCategoryCreated={fetchCategories}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {budgets.map((b) => {
          const percentage = (b.currentSpending / b.limitAmount) * 100;
          const isOver = percentage > 100;
          const isWarning = percentage > 85;

          return (
            <motion.div 
              key={b.id}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="glass rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
            >
              {/* Progress Background */}
              <div 
                className={`absolute top-0 left-0 h-1 transition-all duration-1000 ${isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Target Category</p>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{b.categoryName}</h3>
                </div>
                <div className="flex gap-2">
                  <div className={`p-4 rounded-2xl ${
                    isOver ? 'bg-rose-500/10 text-rose-500' : isWarning ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {isWarning ? <AlertTriangle className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <button 
                    onClick={() => handleDelete(b.id)}
                    className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Currently spent</p>
                    <p className="text-3xl font-black text-white">₹{b.currentSpending.toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase">Limit</p>
                    <p className="text-lg font-bold text-white/50 group-hover:text-white/80 transition-colors">₹{b.limitAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative pt-4">
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={`h-full rounded-full transition-colors duration-500 ${
                        isOver ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 
                        isWarning ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 
                        'bg-gradient-to-r from-indigo-600 to-indigo-400'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-3">
                    <span className={`text-xs font-black uppercase tracking-widest ${isOver ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {isOver ? 'LIMIT EXCEEDED' : isWarning ? 'CAUTION: NEAR LIMIT' : 'WITHIN BUDGET'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{percentage.toFixed(0)}% Utilized</span>
                  </div>
                </div>
              </div>
              
              {/* Card Footer Action */}
              <button className="w-full mt-8 py-4 flex items-center justify-center gap-2 border border-white/5 bg-white/[0.02] rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest group-hover:bg-white/5 group-hover:text-white transition-all">
                Adjust Limits <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}

        {/* Create Card */}
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass rounded-[32px] p-8 border-2 border-dashed border-white/10 bg-transparent hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center min-h-[400px] text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Expand Your Control</h3>
          <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">Add a new spending category and start monitoring it today.</p>
        </motion.button>
      </div>
    </motion.div>
  );
}
