import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(location.pathname === '/register');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', monthlyBudget: '50000' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsRegister(location.pathname === '/register');
    setErrorMessage('');
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(
          formData.name,
          formData.email,
          formData.password,
          Number(formData.monthlyBudget) || 0
        );
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password. If you do not have an account yet, click "Sign up" below.'
          : err.message || 'Authentication failed. Please check your backend server.');
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await login('demo@example.com', 'password123');
      navigate('/');
    } catch (err) {
      // If demo user wasn't registered yet, register it now
      try {
        await register('Demo User', 'demo@example.com', 'password123', 50000);
        navigate('/');
      } catch (regErr) {
        const msg = regErr.response?.data?.message || 'Could not connect to backend. Please ensure the server is running.';
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrendingUp size={32} className="text-primary" />
          <h1 className="text-3xl font-bold text-white">FinanceAI</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-center text-white">
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {isRegister
            ? 'Sign up to start tracking expenses with AI insights'
            : 'Sign in to access your dashboard'}
        </p>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-500/15 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Demo Account Button */}
        {!isRegister && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-500/40 text-blue-200 font-medium py-2.5 px-4 rounded-xl transition duration-200 text-sm shadow-md cursor-pointer"
            >
              <Sparkles size={16} className="text-blue-400" />
              <span>Sign In with Demo Account (Instant Access)</span>
            </button>
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-700 w-full"></div>
              <span className="bg-transparent px-3 text-xs text-gray-500 uppercase tracking-wider">or sign in manually</span>
              <div className="border-t border-gray-700 w-full"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Budget (₹)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="50000"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors mt-6 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
            }}
            className="text-primary hover:underline ml-1.5 font-medium cursor-pointer"
          >
            {isRegister ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
