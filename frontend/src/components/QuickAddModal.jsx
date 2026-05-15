import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionContext } from '../context/TransactionContext';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Salary', 'Entertainment', 'Medical', 'Others'];

const QuickAddModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useContext(TransactionContext);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
    paymentMethod: 'Cash'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction({ ...formData, amount: Number(formData.amount) });
    setFormData({
      type: 'expense',
      amount: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      note: '',
      paymentMethod: 'Cash'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-textMuted hover:text-white bg-card/50 hover:bg-white/10 p-2 rounded-xl transition-all"
            >
              ✕
            </button>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Quick Add</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex bg-card/50 p-1 rounded-xl border border-white/5">
                <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense' ? 'bg-danger text-white shadow-md shadow-danger/20' : 'text-textMuted hover:text-white'}`}>Expense</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'income' ? 'bg-success text-white shadow-md shadow-success/20' : 'text-textMuted hover:text-white'}`}>Income</button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1.5">Amount (₹)</label>
                <input type="number" required min="1" className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1.5">Category</label>
                  <select className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-card">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1.5">Date</label>
                  <input type="date" required className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-1.5">Note (Optional)</label>
                <input type="text" className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="What was this for?" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">Save Transaction</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;
