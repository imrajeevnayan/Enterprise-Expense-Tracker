import { useState } from 'react';
import { X, Target, Calendar, Tag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryService } from '../services/api';
import toast from 'react-hot-toast';

export default function BudgetModal({ isOpen, onClose, onSave, categories }) {
  const [formData, setFormData] = useState({
    limitAmount: '',
    categoryId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await categoryService.create({ 
        name: newCategoryName,
        type: 'EXPENSE'
      });
      toast.success('Category added');
      if (onCategoryCreated) onCategoryCreated();
      setFormData({ ...formData, categoryId: data.id });
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Check connection';
      toast.error(`Error: ${message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      limitAmount: parseFloat(formData.limitAmount),
      categoryId: parseInt(formData.categoryId), // Cast to Number
      month: parseInt(formData.month),
      year: parseInt(formData.year)
    });
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass rounded-[40px] shadow-2xl p-8 border border-white/10"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Set Budget</h2>
              <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Plan your spending limits</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-500 group-focus-within:text-indigo-400 group-hover:text-slate-300">₹</span>
                <input 
                  type="number" 
                  required
                  placeholder="Monthly Limit"
                  value={formData.limitAmount}
                  onChange={(e) => setFormData({...formData, limitAmount: e.target.value})}
                  className="w-full bg-[#0f172a] border border-white/5 rounded-3xl py-6 pl-14 pr-8 text-4xl font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Category
                  </label>
                  <button 
                    type="button"
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
                  >
                    {isAddingCategory ? 'Cancel' : '+ Add New'}
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  {isAddingCategory ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-2"
                    >
                      <input 
                        type="text"
                        autoFocus
                        placeholder="New Category..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="auth-input flex-1 h-14"
                      />
                      <button 
                        type="button"
                        onClick={handleAddCategory}
                        className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.select 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="auth-input h-14 bg-[#1e293b]"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </motion.select>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Month
                  </label>
                  <select 
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    className="auth-input h-14 bg-[#1e293b]"
                  >
                    {months.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                     Year
                  </label>
                  <input 
                    type="number" 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="auth-input h-14" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary py-6 rounded-3xl text-xl font-black tracking-tight flex items-center justify-center gap-3"
            >
              <Target className="w-6 h-6" /> Save Budget Limit
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
