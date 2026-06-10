import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Login successful! Token aur user info browser mein save kar lo
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Agar admin hai toh admin dashboard bhejo, nahi toh home page par
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      // Page refresh taaki navbar state update ho jaye
      window.location.reload();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-black">WELCOME BACK</h2>
        <p className="text-sm text-gray-500 mt-1 font-light">Enter your credentials to access your portal</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded font-medium text-sm flex items-center justify-center space-x-2 hover:bg-gray-900 transition disabled:bg-gray-400"
        >
          <span>{loading ? 'Verifying...' : 'Sign In'}</span>
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}