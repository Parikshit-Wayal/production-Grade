import React from 'react';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User, LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';

// Chote dummy components (Temporary jab tak asli files nahi banti)

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        
        {/* Minimalist Top Navigation Bar */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link to="/" className="text-lg font-bold tracking-wider text-black uppercase">
              MINIMAL.<span className="font-light text-gray-500">SHOP</span>
            </Link>

            {/* Nav Links with Clean Icons */}
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
              <Link to="/cart" className="flex items-center space-x-1 hover:text-black transition">
                <ShoppingCart size={18} />
                <span>Kart</span>
              </Link>
              <Link to="/orders" className="flex items-center space-x-1 hover:text-black transition">
                <ClipboardList size={18} />
                <span>Orders</span>
              </Link>
              <Link to="/admin" className="flex items-center space-x-1 hover:text-black transition">
                <LayoutDashboard size={18} />
                <span>Admin</span>
              </Link>
              <Link to="/login" className="flex items-center space-x-1 border border-black px-3 py-1.5 rounded hover:bg-black hover:text-white transition">
                <User size={16} />
                <span>Login</span>
              </Link>
            </div>

          </div>
        </nav>

        {/* Dynamic Route Content Placement */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}