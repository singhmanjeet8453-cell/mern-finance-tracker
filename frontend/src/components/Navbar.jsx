import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, Settings, LogOut, AlertCircle, Info } from 'lucide-react';
import QuickAddModal from './QuickAddModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { transactions } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // clear after search
    }
  };

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    ? transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0)
    : 0;
  
  const budgetRatio = user?.monthlyBudget ? (monthlyExpenses / user.monthlyBudget) * 100 : 0;

  return (
    <>
      <nav className="glass sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/5">
        <div className="flex h-20 items-center px-4 sm:px-6 lg:px-8 justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full bg-background/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} /> Quick Add
            </button>
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 text-textMuted hover:text-white bg-card/50 hover:bg-white/10 rounded-xl transition-all border border-white/5"
              >
                <Bell size={20} />
                {(budgetRatio > 80 || !transactions || transactions.length === 0) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border border-card shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {budgetRatio > 80 ? (
                      <div className="p-3 rounded-xl flex gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <AlertCircle className="text-danger flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium text-white">Budget Alert</p>
                          <p className="text-xs text-textMuted mt-1">You have spent {budgetRatio.toFixed(1)}% of your monthly budget (₹{monthlyExpenses} / ₹{user?.monthlyBudget}).</p>
                        </div>
                      </div>
                    ) : null}
                    {!transactions || transactions.length === 0 ? (
                      <div className="p-3 rounded-xl flex gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <Info className="text-primary flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium text-white">Welcome!</p>
                          <p className="text-xs text-textMuted mt-1">Start by adding your first transaction using Quick Add.</p>
                        </div>
                      </div>
                    ) : budgetRatio <= 80 ? (
                      <div className="p-3 rounded-xl flex gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <Info className="text-success flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-medium text-white">All caught up</p>
                          <p className="text-xs text-textMuted mt-1">Your finances are looking good this month.</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 relative" ref={profileRef}>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
                <p className="text-xs text-success font-medium">Pro Member</p>
              </div>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 cursor-pointer hover:scale-105 transition-transform border border-white/10"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10 bg-white/5">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-textMuted truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-textMuted hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <button 
                      onClick={() => { setIsProfileOpen(false); logout(); navigate('/login'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
