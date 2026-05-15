import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, DollarSign, Save, KeyRound } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    monthlyBudget: user?.monthlyBudget || '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        monthlyBudget: Number(formData.monthlyBudget)
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await updateUser(updateData);
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold text-white">Account Settings</h1>
        <p className="text-textMuted mt-1">Manage your profile and preferences</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass rounded-2xl p-8 border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-textMuted">Update your personal details below.</p>
            </div>
          </div>

          {error && <div className="p-4 bg-danger/20 text-danger border border-danger/30 rounded-xl text-sm font-medium">{error}</div>}
          {success && <div className="p-4 bg-success/20 text-success border border-success/30 rounded-xl text-sm font-medium">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                <DollarSign size={16} /> Monthly Budget (₹)
              </label>
              <input 
                type="number" 
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleChange}
                className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                <KeyRound size={16} /> New Password
              </label>
              <input 
                type="password" 
                name="password"
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50 px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Saving...</span> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
