import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as dataService from '../services/dataService';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Package,
  User,
  QrCode
} from 'lucide-react';

export default function Checkout() {
  const { cartItems, total, subtotal, shipping, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  // Automatically sync user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Payment method: 'card' | 'upi' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: user?.name || ''
  });
  const [upiId, setUpiId] = useState('');

  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardDetails(prev => ({ ...prev, expiry: val }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!user) {
      setFormError('Please sign in or create an account to complete checkout.');
      return;
    }

    // Basic Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim() || !formData.zip.trim()) {
      setFormError('Please fill out all required shipping address fields.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 12) {
        setFormError('Please enter a valid card number.');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        setFormError('Please enter a valid expiration date (MM/YY).');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        setFormError('Please enter a valid CVV.');
        return;
      }
    }

    if (cartItems.length === 0) {
      setFormError('Your fragrance bag is empty.');
      return;
    }

    setProcessing(true);
    try {
      const order = await dataService.createOrder({
        userId: user.id,
        items: cartItems.map(item => ({
          id: item.id,
          cartItemId: item.cartItemId,
          name: item.name,
          brand: item.brand,
          family: item.family,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          imageUrl: item.imageUrl
        })),
        total,
        address: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          street: `${formData.street}${formData.apartment ? ', ' + formData.apartment : ''}`,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? 'Direct Transfer / UPI' : 'Cash on Delivery'
        }
      });

      clearCart();
      setCompletedOrder(order);
    } catch (err) {
      console.error('Order creation failed:', err);
      setFormError('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // If user is not logged in, ask them to sign in or create an account
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white/90 rounded-3xl p-8 sm:p-12 text-center border border-sage-200/80 shadow-soft-lg space-y-6">
          <div className="w-16 h-16 bg-cream-100 text-sage-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold-600 block">
              Authentication Required
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">
              Sign In to Complete Checkout
            </h1>
            <p className="text-xs sm:text-sm text-sage-600 max-w-md mx-auto leading-relaxed">
              Please sign in to your account or create a new one to complete your order, choose your delivery address, and track your artisanal fragrances.
            </p>
          </div>

          <div className="bg-cream-50/80 rounded-2xl p-4 border border-sage-100 text-xs text-sage-700 flex justify-between items-center">
            <span>Items in Bag: <strong className="text-sage-900">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</strong></span>
            <span>Total: <strong className="text-sage-900 font-serif text-sm">${total.toFixed(2)}</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/auth"
              state={{ from: { pathname: '/checkout' }, message: 'Please sign in to proceed with your order.' }}
              className="flex-1 bg-sage-800 hover:bg-sage-900 text-cream-50 font-semibold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition shadow-soft flex items-center justify-center gap-2"
            >
              <User size={15} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/auth"
              state={{ from: { pathname: '/checkout' }, isSignup: true, message: 'Create an account to complete your order.' }}
              className="flex-1 border border-sage-300 hover:bg-sage-100 text-sage-800 font-semibold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/cart"
              className="text-xs text-sage-500 hover:text-sage-800 underline underline-offset-4 transition"
            >
              ← Return to Fragrance Bag
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If order is completed, show celebration confirmation screen!
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white/90 rounded-3xl p-8 sm:p-12 border border-sage-200/80 shadow-soft-lg text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={42} />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold-600">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-sage-600">
              Order Reference: <span className="font-mono font-bold text-sage-900 bg-sage-100 px-2.5 py-1 rounded-md">{completedOrder.id}</span>
            </p>
          </div>

          <p className="text-xs text-sage-700 max-w-lg mx-auto leading-relaxed">
            Your artisanal extraction has been received. Our master parfumier will hand-label, wax-seal, and prepare your flacons for delivery.
          </p>

          {/* Ordered items preview */}
          <div className="bg-cream-50/80 rounded-2xl p-6 border border-sage-100 text-left space-y-4">
            <h3 className="font-serif text-sm font-bold text-sage-950 uppercase tracking-wider">
              Dispatched Selection
            </h3>
            <div className="divide-y divide-sage-200/60">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="font-semibold text-sage-900">{item.name}</p>
                      <p className="text-sage-500">{item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sage-900">${item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-sage-200 flex justify-between font-serif font-bold text-sm text-sage-950">
              <span>Total Paid</span>
              <span>${completedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery summary */}
          <div className="text-xs text-sage-600 bg-cream-100/50 p-4 rounded-xl text-left space-y-1">
            <p className="font-semibold text-sage-900">Destination:</p>
            <p>{completedOrder.address.fullName}</p>
            <p>{completedOrder.address.street}, {completedOrder.address.city}, {completedOrder.address.state} {completedOrder.address.zip}</p>
            <p className="pt-1 text-[11px] text-sage-500">Payment: {completedOrder.address.paymentMethod}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sage-800 hover:bg-sage-900 text-cream-50 font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition shadow-soft"
            >
              <Package size={15} />
              <span>View My Orders</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-sage-300 hover:bg-sage-100 text-sage-800 font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition"
            >
              <span>Explore More Fragrances</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no order placed
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-sage-950">No Items in Your Bag</h2>
        <p className="text-xs text-sage-600">Your fragrance selection is currently empty.</p>
        <div>
          <Link
            to="/shop"
            className="inline-block bg-sage-800 text-cream-50 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sage-900 transition"
          >
            Explore Fragrance Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
          Finalize Acquisition
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
          Botanical Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Shipping Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-sage-100">
              <Truck className="text-sage-700 w-5 h-5" />
              <h2 className="font-serif text-xl font-bold text-sage-950">1. Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Genevieve Moreau"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. genevieve@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address or P.O. Box"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Apartment / Suite (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apt, Suite, Floor"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  placeholder="State"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  ZIP / Postal Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                  placeholder="Postal code"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-sage-100">
              <div className="flex items-center gap-3">
                <CreditCard className="text-sage-700 w-5 h-5" />
                <h2 className="font-serif text-xl font-bold text-sage-950">2. Payment Method</h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={13} /> 256-Bit Secure
              </span>
            </div>

            {/* Payment Options Selection */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'upi', label: 'Direct Transfer', icon: QrCode },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === p.id
                        ? 'border-sage-900 bg-sage-900 text-cream-50 shadow-soft'
                        : 'border-sage-200 bg-cream-50/50 text-sage-800 hover:border-sage-400'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-cream-100/60 p-5 rounded-2xl border border-sage-200/60 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 •••• •••• 4242"
                    maxLength={19}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white font-mono text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white font-mono text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white font-mono text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                    placeholder="Name as it appears on card"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="bg-cream-100/60 p-5 rounded-2xl border border-sage-200/60 space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-700">
                  Direct Bank Transfer / UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@bank"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <p className="text-[11px] text-sage-600">
                  Instant order processing with secure direct clearing.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-cream-100/60 p-5 rounded-2xl border border-sage-200/60 space-y-1.5">
                <span className="text-xs font-semibold text-sage-900">White-Glove Concierge Hand-Delivery</span>
                <p className="text-[11px] text-sage-600">
                  Pay securely upon arrival. Your flacons will be hand-delivered in signature wax-sealed botanical packaging.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="space-y-6">
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-sage-950">Your Selection</h2>

            {/* Items list */}
            <div className="divide-y divide-sage-100 max-h-72 overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-cream-100" />
                    <div>
                      <p className="font-semibold text-sage-900 line-clamp-1">{item.name}</p>
                      <p className="text-sage-500">{item.size} • Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sage-900">${item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-sage-600 pt-3 border-t border-sage-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-sage-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-sage-900">
                  {shipping === 0 ? <span className="text-emerald-700">Complimentary</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-sage-200 flex justify-between font-serif font-bold text-base text-sage-950">
                <span>Total Due</span>
                <span className="text-xl text-sage-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-blush-500 bg-blush-50 p-2.5 rounded-xl border border-blush-200">{formError}</p>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-sage-800 hover:bg-sage-900 active:scale-98 text-cream-50 font-semibold py-4 px-6 rounded-2xl transition shadow-soft flex items-center justify-center gap-2 uppercase tracking-wider text-xs disabled:opacity-50"
            >
              <Lock size={15} />
              <span>{processing ? 'Processing Order...' : `Place Order • $${total.toFixed(2)}`}</span>
            </button>

            <div className="text-[11px] text-sage-500 text-center leading-relaxed">
              Encrypted with 256-bit SSL. Your personal details are completely private and secure.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
