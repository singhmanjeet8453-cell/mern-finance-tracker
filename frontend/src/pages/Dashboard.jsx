import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, TrendingDown, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { transactions } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsPercent = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
  const budgetProgress = user?.monthlyBudget ? Math.min((totalExpense / user.monthlyBudget) * 100, 100) : 0;

  const expensesByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({ name: key, value: expensesByCategory[key] }));
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#6366F1'];

  const barData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense }
  ];

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="font-medium text-white">{payload[0].name}</p>
          <p className="text-primary font-bold">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
          <p className="text-textMuted mt-1">Track your financial performance</p>
        </div>
      </motion.div>
      
      {/* Metrics Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-primary/20 text-primary rounded-xl shadow-inner"><Wallet size={24}/></div>
            <div>
              <p className="text-textMuted text-sm font-medium">Remaining Balance</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">₹{balance.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-success/20 text-success rounded-xl shadow-inner"><TrendingUp size={24}/></div>
            <div>
              <p className="text-textMuted text-sm font-medium">Total Income</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">₹{totalIncome.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-danger/20 text-danger rounded-xl shadow-inner"><TrendingDown size={24}/></div>
            <div>
              <p className="text-textMuted text-sm font-medium">Total Expense</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">₹{totalExpense.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-warning/20 text-warning rounded-xl shadow-inner"><Target size={24}/></div>
            <div>
              <p className="text-textMuted text-sm font-medium">Savings %</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{savingsPercent}%</h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Budget Progress */}
      {user?.monthlyBudget > 0 && (
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-semibold text-lg text-white">Monthly Budget Progress</h3>
              <p className="text-sm text-textMuted mt-1">₹{totalExpense.toLocaleString()} of ₹{user.monthlyBudget.toLocaleString()}</p>
            </div>
            <span className={`font-bold text-lg ${budgetProgress > 85 ? 'text-danger' : 'text-success'}`}>{budgetProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden shadow-inner border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${budgetProgress > 85 ? 'bg-gradient-to-r from-red-500 to-danger' : 'bg-gradient-to-r from-primary to-blue-500'} relative`}
            >
              <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
            </motion.div>
          </div>
          {budgetProgress > 100 && <p className="text-danger text-sm mt-3 font-medium">⚠️ You have exceeded your monthly budget!</p>}
        </motion.div>
      )}

      {/* Charts & Recent Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl min-h-[350px] lg:col-span-1 flex flex-col">
          <h3 className="font-semibold mb-6 text-lg text-white">Expenses by Category</h3>
          {pieData.length > 0 ? (
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-textMuted text-center">No expense data yet.</p>
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl min-h-[350px] lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-white">Income vs Expense</h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip cursor={{fill: '#ffffff05'}} content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions List */}
      <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
          <button className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1 group">
            View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((tx, idx) => (
              <motion.div 
                key={tx._id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    {tx.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-primary transition-colors">{tx.title}</p>
                    <p className="text-xs text-textMuted mt-0.5">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-textMuted py-8">No transactions found. Start by adding one!</p>
        )}
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
