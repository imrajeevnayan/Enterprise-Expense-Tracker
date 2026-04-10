import { useState, useEffect } from 'react';
import { transactionService, budgetService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, TrendingUp, TrendingDown, Wallet, LogOut, ArrowUpRight, ArrowDownRight, MoreVertical, Receipt, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionModal from '../components/TransactionModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [data, setData] = useState({ transactions: [], budgets: [], summary: { income: 0, expense: 0, balance: 0 } });
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchData();
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
      toast.success('Movement recorded successfully 💸');
      setIsTxModalOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Check database connection';
      toast.error(`Error: ${message}`);
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const [{ data: transactionsResponse }, { data: budgetsResponse }] = await Promise.all([
        transactionService.getAll(0, 5),
        budgetService.getAll(new Date().getMonth() + 1, new Date().getFullYear())
      ]);

      const transactions = transactionsResponse?.content || [];
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 text-muted mb-2 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            Hey, <span className="text-gradient">{user?.name}</span> 👋
          </h1>
          <p className="text-muted text-lg mt-1 font-medium">Welcome back to your financial control center.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
          <button 
            onClick={() => setIsTxModalOpen(true)}
            className="btn-primary flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> 
            New Transaction
          </button>
        </motion.div>
      </div>

      <TransactionModal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleAddTransaction}
        categories={categories}
        onCategoryCreated={fetchCategories}
      />

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard 
          title="Total Balance" 
          amount={data.summary.balance} 
          icon={<Wallet className="w-8 h-8" />}
          gradient="from-primary to-accent"
          variants={itemVariants}
        />
        <SummaryCard 
          title="Income" 
          amount={data.summary.income} 
          icon={<TrendingUp className="w-8 h-8" />}
          gradient="from-emerald-500 to-teal-400"
          variants={itemVariants}
        />
        <SummaryCard 
          title="Expenses" 
          amount={data.summary.expense} 
          icon={<TrendingDown className="w-8 h-8" />}
          gradient="from-rose-500 to-orange-400"
          variants={itemVariants}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Analytics Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-foreground">Spending Analysis</h3>
              <p className="text-muted text-sm font-medium">Your activity overview</p>
            </div>
            <div className="flex gap-1 bg-secondary p-1 rounded-xl border border-border">
               <button className="px-5 py-1.5 rounded-lg text-xs font-bold bg-background text-primary shadow-sm">WEEK</button>
               <button className="px-5 py-1.5 rounded-lg text-xs font-bold text-muted hover:text-foreground transition-colors">MONTH</button>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.transactions.slice().filter(t => t.type === 'EXPENSE').reverse()}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="transactionDate" 
                  stroke="var(--muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="var(--muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(20px)'
                  }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Budgets Sidebar */}
        <motion.div variants={itemVariants} className="glass-card p-8 h-fit">
          <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">Active Budgets</h3>
            <button className="bg-primary/10 p-2 rounded-lg hover:bg-primary/20 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>

          <div className="space-y-6">
            {data.budgets.length > 0 ? data.budgets.map(b => {
              const percentage = Math.min((b.currentSpending / b.limitAmount) * 100, 100);
              const isHigh = percentage > 85;
              
              return (
                <div key={b.id} className="relative group/budget">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-muted text-[10px] uppercase tracking-widest font-bold mb-1 group-hover/budget:text-primary transition-colors">{b.categoryName}</p>
                      <h4 className="text-foreground font-extrabold text-lg">₹{b.currentSpending.toLocaleString()}</h4>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black ${isHigh ? 'text-rose-500' : 'text-primary'}`}>
                        {percentage.toFixed(0)}%
                      </p>
                      <p className="text-[10px] text-muted font-medium">of ₹{b.limitAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden border border-border shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isHigh ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      }`}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-muted" />
                </div>
                <p className="text-muted text-sm font-medium">No budgets set yet.</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-10 py-3.5 rounded-xl bg-primary/5 border border-primary/20 text-primary font-bold hover:bg-primary/10 transition-all text-sm uppercase tracking-widest active:scale-[0.98]">
            Plan New Budget
          </button>
        </motion.div>
      </div>

      {/* Recent Transactions List */}
      <motion.div variants={itemVariants} className="glass-card p-8">
        <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
          <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
          <button className="text-xs font-black text-primary hover:text-accent transition-colors uppercase tracking-widest">
            View Statement
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {data.transactions.length > 0 ? data.transactions.map((t, index) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl ${
                    t.type === 'INCOME' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {t.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground">{t.categoryName}</p>
                    <p className="text-[11px] text-muted font-bold uppercase tracking-tight">{t.transactionDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <p className={`text-lg font-black ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                  </p>
                  <button className="text-muted hover:text-foreground transition-colors p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-10 text-center">
                <p className="text-muted font-medium">No recent activity.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SummaryCard({ title, amount, icon, gradient, variants }) {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`p-10 rounded-[28px] bg-card border border-border shadow-xl relative overflow-hidden group transition-all duration-500`}
    >
      {/* Decorative Glow Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity blur-3xl`} />
      
      <div className="relative z-10">
        <div className={`bg-gradient-to-br ${gradient} w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 shadow-lg shadow-primary/20 transform group-hover:rotate-6 transition-transform duration-500`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3">{title}</p>
        <h2 className="text-4xl font-black text-foreground tracking-tight">
          ₹{amount.toLocaleString()}
        </h2>
        
        <div className="mt-6 flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-wider">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live View
        </div>
      </div>
    </motion.div>
  );
}
