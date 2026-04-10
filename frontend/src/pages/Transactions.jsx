import { useState, useEffect } from 'react';
import { transactionService, categoryService, reportService } from '../services/api';
import { Search, Plus, Filter, Trash2, ArrowUpRight, ArrowDownLeft, Calendar, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionModal from '../components/TransactionModal';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (err) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const response = await reportService.getMonthlyReport(firstDay, lastDay);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${firstDay}_to_${lastDay}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Error generating report');
    }
  };

  useEffect(() => {
    fetchTransactions();
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

  const handleAddTransaction = async (txData) => {
    try {
      await transactionService.create(txData);
      setIsTxModalOpen(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await transactionService.getAll(0, 50);
      setTransactions(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTransactions(prev => Array.isArray(prev) ? prev : []);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Transactions</h1>
          <p className="text-slate-400 text-lg">Monitor and manage all your financial movements with precision.</p>
        </div>
        <button 
          onClick={() => setIsTxModalOpen(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
          Add Transaction
        </button>
      </div>

      <TransactionModal 
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleAddTransaction}
        categories={categories}
      />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by description, category or date..." 
            className="auth-input pl-12 h-14" 
          />
        </div>
        <div className="flex gap-4">
          <button className="btn-outline flex items-center gap-2 h-14 px-8">
            <Filter className="w-5 h-5" /> Filters
          </button>
          <button 
            onClick={handleExportPDF}
            className="btn-outline flex items-center gap-2 h-14 px-8 border-indigo-500/20 text-indigo-400"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass rounded-[32px] overflow-hidden shadow-2xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">Description</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">Date</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">Type</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence>
                {transactions.length > 0 ? transactions.map((t, idx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={t.id} 
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                        <p className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{t.description || 'General Transaction'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t.categoryName}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Calendar className="w-4 h-4 opacity-50" /> {t.transactionDate}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`flex items-center gap-2 text-sm font-black tracking-widest uppercase ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'INCOME' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        {t.type}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className={`text-xl font-black tracking-tighter ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-white'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount?.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )) : null}
              </AnimatePresence>
            </tbody>
          </table>
          
          {transactions.length === 0 && !loading && (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No transactions found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination Hook */}
      <div className="flex justify-between items-center px-4">
        <p className="text-slate-500 text-sm font-medium">Showing <span className="text-white">{transactions.length}</span> results</p>
        <div className="flex gap-2">
           <button className="px-6 py-2 rounded-xl bg-white/5 text-slate-400 font-bold text-xs uppercase disabled:opacity-30" disabled>Previous</button>
           <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase shadow-lg shadow-indigo-600/20">Next</button>
        </div>
      </div>
    </motion.div>
  );
}
