import React, { useContext, useState, useMemo } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Plus, Trash2, Download, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickAddModal from '../components/QuickAddModal';

const Transactions = () => {
  const { transactions, deleteTransaction } = useContext(TransactionContext);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchType = filterType === 'All' ? true : tx.type === filterType.toLowerCase();
      const matchSearch = tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) || tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transactions</h1>
          <p className="text-textMuted mt-1">Manage your income and expenses</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none glass hover:bg-white/10 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button onClick={() => setShowModal(true)} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Plus size={18} /> <span>Add New</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/30">
          <div className="flex bg-card/50 p-1 rounded-xl w-full sm:w-auto border border-white/5">
            {['All', 'Income', 'Expense'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card/40 border-b border-white/5 text-textMuted">
                <th className="p-4 text-sm font-medium uppercase tracking-wider">Date</th>
                <th className="p-4 text-sm font-medium uppercase tracking-wider">Category</th>
                <th className="p-4 text-sm font-medium uppercase tracking-wider">Note</th>
                <th className="p-4 text-sm font-medium uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-sm font-medium uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-textMuted">No transactions found matching your criteria.</td></tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <motion.tr 
                      key={tx._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 whitespace-nowrap text-white/90">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/80">{tx.category}</span>
                      </td>
                      <td className="p-4 text-textMuted truncate max-w-[200px]">{tx.note || '-'}</td>
                      <td className={`p-4 font-bold text-right ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteTransaction(tx._id)} className="text-textMuted hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <QuickAddModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
};

export default Transactions;
