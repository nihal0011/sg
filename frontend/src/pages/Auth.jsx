import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignup);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || '');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-sage-200/80 shadow-soft-lg space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sage-800 text-gold-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <span className="text-xl">🌿</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-sage-950">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-sage-600">
            {isLogin
              ? 'Access your private fragrance wishlist and order archives'
              : 'Join our sanctuary to curate your personal fragrance wardrobe'}
          </p>
        </div>



        {/* Tab switchers */}
        <div className="flex bg-cream-100 p-1 rounded-2xl text-xs font-semibold text-sage-700">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition ${
              isLogin ? 'bg-white text-sage-950 shadow-sm' : 'hover:text-sage-950'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition ${
              !isLogin ? 'bg-white text-sage-950 shadow-sm' : 'hover:text-sage-950'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-blush-50 border border-blush-200 text-blush-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Genevieve Moreau"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-800 hover:bg-sage-900 active:scale-98 text-cream-50 font-semibold py-3.5 px-4 rounded-2xl transition shadow-soft uppercase tracking-wider text-xs disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Conservatory' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
