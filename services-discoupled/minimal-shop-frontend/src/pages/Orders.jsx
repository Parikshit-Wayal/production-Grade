import React, { useEffect, useState } from 'react';
import { Package, Calendar, MapPin, DollarSign } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/orders/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <div className="text-center py-12 text-sm font-light text-gray-500">Please sign in to view your order logs. 🔒</div>;
  }

  if (loading) {
    return <div className="text-center py-12 text-sm font-light tracking-wide">FETCHING SECURE LOGS...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-black">ORDER HISTORY & STATUS</h2>
        <p className="text-sm text-gray-500 font-light mt-1">Immutable ledger of your past fulfillments.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg text-gray-400 font-light text-sm space-y-2">
          <Package className="mx-auto text-gray-300" size={32} />
          <p>No deployment/order records found for this account.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
              
              {/* Order Metadata Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">ID: {order._id}</span>
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="space-y-3">
                {order.items.map((item) => item.productId && (
                  <div key={item._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-medium">{item.productId.name}</span>
                      <span className="text-gray-400 text-xs">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">${item.productId.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Address & Total */}
              <div className="border-t border-gray-100 pt-4 flex flex-wrap justify-between items-center text-sm gap-2">
                <div className="flex items-center space-x-1.5 text-gray-500 font-light text-xs">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Ship to: {order.address}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-light">Total Paid</span>
                  <span className="text-base font-bold text-black">${order.totalAmount}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}