import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, Plus } from 'lucide-react';
import QuickAddModal from './QuickAddModal';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            
            <button className="relative p-2.5 text-textMuted hover:text-white bg-card/50 hover:bg-white/10 rounded-xl transition-all border border-white/5">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border border-card shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
                <p className="text-xs text-success font-medium">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 cursor-pointer hover:scale-105 transition-transform border border-white/10">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
