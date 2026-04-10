import { useState, useEffect } from 'react';
import { transactionService, budgetService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Download, TrendingUp, TrendingDown, Wallet, LogOut, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState({ transactions: [], budgets: [], summary: { income: 0, expense: 0, balance: 0 } });
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: transactionsResponse }, { data: budgetsResponse }] = await Promise.all([
        transactionService.getAll(0, 5),
        budgetService.getAll(new Date().getMonth() + 1, new Date().getFullYear())
      ]);

      const transactions = transactionsResponse.content || [];
      const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

      setData({
        transactions,
        budgets: budgetsResponse,
        summary: { income, expense, balance: income - expense }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Hey, <span className="text-indigo-400">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-400 text-lg">Detailed overview of your financial status.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
          <button className="btn-primary flex items-center gap-2 group">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> 
            New Transaction
          </button>
          <button onClick={logout} className="p-3 glass rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-red-500/10 hover:border-red-500/20">
            <LogOut className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <SummaryCard 
          title="Total Balance" 
          amount={data.summary.balance} 
          icon={<Wallet className="w-8 h-8" />}
          gradient="from-indigo-600 via-indigo-500 to-blue-500"
          variants={itemVariants}
        />
        <SummaryCard 
          title="Income" 
          amount={data.summary.income} 
          icon={<TrendingUp className="w-8 h-8" />}
          gradient="from-emerald-600 via-emerald-500 to-teal-400"
          variants={itemVariants}
        />
        <SummaryCard 
          title="Expenses" 
          amount={data.summary.expense} 
          icon={<TrendingDown className="w-8 h-8" />}
          gradient="from-rose-600 via-rose-500 to-orange-400"
          variants={itemVariants}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {data.transactions.length > 0 ? data.transactions.map((t, index) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${
                      t.type === 'INCOME' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {t.type === 'INCOME' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{t.categoryName}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{t.transactionDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className={`text-xl font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                    </p>
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-lg">No transactions recorded yet.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Budgets Sidebar */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-8 shadow-2xl h-fit">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">Budgets</h3>
            <button className="bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Plus className="w-5 h-5 text-indigo-400" />
            </button>
          </div>

          <div className="space-y-8">
            {data.budgets.length > 0 ? data.budgets.map(b => {
              const percentage = Math.min((b.currentSpending / b.limitAmount) * 100, 100);
              const isHigh = percentage > 85;
              
              return (
                <div key={b.id} className="relative">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{b.categoryName}</p>
                      <h4 className="text-white font-bold text-lg">₹{b.currentSpending.toLocaleString()}</h4>
                    </div>
                    <p className={`text-sm font-semibold ${isHigh ? 'text-rose-400' : 'text-slate-500'}`}>
                      {percentage.toFixed(0)}% of ₹{b.limitAmount.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isHigh 
                          ? 'bg-gradient-to-r from-rose-600 to-rose-400' 
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-400'
                      }`}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-center text-slate-500 py-8">No budgets set for this month.</p>
            )}
          </div>
          
          <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
            Plan New Budget
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ title, amount, icon, gradient, variants }) {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`p-8 rounded-[32px] bg-gradient-to-br ${gradient} shadow-2xl relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">{title}</p>
        <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-baseline">
          ₹{amount.toLocaleString()}
        </h2>
        
        <div className="mt-4 flex items-center gap-2 text-white/50 text-xs font-semibold">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          Updated just now
        </div>
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute inset-0 border border-white/20 rounded-[32px] pointer-events-none" />
    </motion.div>
  );
}
