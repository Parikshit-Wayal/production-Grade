import React, { useState } from 'react';
import { PackagePlus, DollarSign, Layers, FileText } from 'lucide-react';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized access! Please login as Admin. 🔒');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price: Number(price), description, stock: Number(stock) })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setMessage('Product catalog updated successfully! 📦');
      // Form fields ko clear kar do
      setName('');
      setPrice('');
      setDescription('');
      setStock('');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-black">ADMIN INVENTORY MANAGEMENT</h2>
        <p className="text-sm text-gray-500 font-light mt-1">Direct cryptographic access to global inventory databases.</p>
      </div>

      {message && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded font-medium">{message}</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded font-medium">{error}</div>}

      <form onSubmit={handleAddProduct} className="bg-white border border-gray-200 rounded-lg p-8 space-y-5 shadow-sm">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Product Name</label>
          <div className="relative">
            <PackagePlus className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
              placeholder="e.g., Wireless Mechanical Keyboard"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Price (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
                placeholder="99"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Available Stock</label>
            <div className="relative">
              <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Product Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea 
              rows="3" required value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-black transition"
              placeholder="Provide clean minimalist specification logs..."
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-2.5 rounded font-medium text-sm hover:bg-gray-900 transition"
        >
          Publish Product to Store
        </button>
      </form>
    </div>
  );
}