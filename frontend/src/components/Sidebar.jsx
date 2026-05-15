import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BrainCircuit, LogOut, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'AI Insights', path: '/ai-insights', icon: BrainCircuit },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card/50 backdrop-blur-md hidden md:flex flex-col border-r border-white/5 shadow-2xl relative z-10">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">FinanceAI</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive && item.path !== '#' ? 'bg-primary/10 text-primary shadow-sm' : 'text-textMuted hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && item.path !== '#' && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive && item.path !== '#' ? 'text-primary' : ''}`} />
                <span className="font-medium tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-white/5">
        <button
          onClick={logout}
          className="group flex items-center gap-3 px-4 py-3 w-full rounded-xl text-textMuted hover:bg-danger/10 hover:text-danger transition-all duration-300"
        >
          <LogOut size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
