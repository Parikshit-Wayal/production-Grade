import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) return;

    try {
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({ productId: item.productId._id, quantity: item.quantity })),
          totalAmount: calculateTotal(),
          address
        })
      });

      if (response.ok) {
        setMessage('Order checkout complete! Check status in Orders log. 🎉');
        setCart({ items: [] }); // Local cart clear
        setAddress('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
  };

  if (!token) {
    return <div className="text-center py-12 text-sm font-light text-gray-500">Please sign in to access your custom checkout matrix. 🔒</div>;
  }

  if (loading) {
    return <div className="text-center py-12 text-sm font-light tracking-wide">COMPUTING KART MATRIX...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-black">YOUR SHOPPING KART</h2>
        <p className="text-sm text-gray-500 font-light mt-1">Review and fulfill your curated essentials.</p>
      </div>

      {message && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded font-medium">{message}</div>}

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg text-gray-400 font-light text-sm space-y-2">
          <ShoppingBag className="mx-auto text-gray-300" size={32} />
          <p>Your kart is completely lightweight right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => item.productId && (
              <div key={item._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center p-2">
                    <img src={item.productId.image} alt="" className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.productId.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold block text-black">${item.productId.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit space-y-5 shadow-sm">
            <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">Order Summary</h3>
            <div className="border-b border-gray-100 pb-3 flex justify-between text-sm">
              <span className="text-gray-500 font-light">Subtotal</span>
              <span className="font-semibold text-black">${calculateTotal()}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Shipping Address</label>
                <input 
                  type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition"
                  placeholder="Street, City, Zip Code"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-2.5 rounded font-medium text-sm flex items-center justify-center space-x-2 hover:bg-gray-900 transition"
              >
                <CreditCard size={16} />
                <span>Secure Checkout</span>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}