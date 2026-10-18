import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dataService from '../services/dataService';
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const list = await dataService.getUserOrders(user.id);
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 size={13} className="text-emerald-600" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Truck size={13} className="text-blue-600" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock size={13} className="text-amber-600" /> {status || 'Processing'}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
          Acquisitions Archive
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
          My Fragrance Orders
        </h1>
        <p className="text-xs text-sage-600 mt-1">
          Historical records of your artisanal flacons and deliveries.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-sage-100/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-12 text-center border border-sage-200 shadow-soft max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-cream-100 text-sage-400 rounded-full flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-sage-950">No Past Orders Found</h2>
          <p className="text-xs text-sage-600 max-w-sm mx-auto leading-relaxed">
            You haven't placed any perfume acquisitions yet. Explore our botanical collection to begin your journey.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sage-900 transition shadow-soft"
            >
              <span>Explore Fragrances</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/90 rounded-3xl border border-sage-200/80 shadow-soft overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-5 sm:p-6 bg-cream-100/60 border-b border-sage-200/60 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-sage-950">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sage-500">
                    <Calendar size={13} />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-sage-500 block">Total Amount</span>
                  <span className="font-serif text-xl font-bold text-sage-950">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 sm:p-6 divide-y divide-sage-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-xl bg-cream-100 shadow-sm"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-sage-500">
                          {item.brand}
                        </span>
                        <Link to={`/product/${item.id}`} className="block">
                          <h4 className="font-serif text-sm font-bold text-sage-950 hover:text-sage-700 transition">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-sage-600">
                          {item.size} • Qty: {item.quantity} × ${item.unitPrice}
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold text-sm text-sage-900">
                      ${item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address footer */}
              {order.address && (
                <div className="px-6 py-3.5 bg-cream-50/50 border-t border-sage-100 text-xs text-sage-600 flex flex-wrap justify-between items-center gap-2">
                  <span>
                    Delivering to: <strong className="text-sage-800">{order.address.fullName}</strong>, {order.address.street}, {order.address.city}
                  </span>
                  <span className="font-mono text-[11px] text-sage-500">
                    Payment: {order.address.paymentMethod?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
