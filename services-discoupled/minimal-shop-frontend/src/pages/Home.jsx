import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Backend se products fetch karne ke liye hook
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Cart mein item add karne ka function
  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first to add items to kart! 🔒');
      return;
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        setMessage('Item added to kart successfully! 🛒');
        setTimeout(() => setMessage(''), 3000); // 3 seconds baad notification gayab
      }
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm font-light tracking-wide">LOADING EXPERIENCES...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Visual Toast Notification Banner */}
      {message && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-6 py-3 rounded text-sm font-medium shadow-lg z-50 transition-all">
          {message}
        </div>
      )}

      {/* Modern Minimal Hero Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-black">ESSENTIAL COLLECTION</h1>
        <p className="text-gray-500 font-light max-w-md mx-auto text-sm">
          Simplicity is the ultimate sophistication. Discover our handpicked premium everyday utilities.
        </p>
      </div>

      {/* Product Display Grid Setup */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-light text-sm">No products available in store right now.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between group hover:shadow-sm transition">
              
              {/* Product Image Frame */}
              <div className="bg-gray-50 aspect-square flex items-center justify-center p-4 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-48 object-contain group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Product Meta Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900 tracking-tight">{product.name}</h3>
                  <p className="text-gray-500 text-xs font-light mt-1 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-black">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product._id)}
                    className="flex items-center space-x-1.5 border border-black text-black px-3 py-1.5 rounded text-xs font-medium hover:bg-black hover:text-white transition"
                  >
                    <Plus size={14} />
                    <span>Add to Kart</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}