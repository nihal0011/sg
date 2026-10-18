import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as dataService from '../services/dataService';
import { useCart, SIZE_PRICE_MULTIPLIERS } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Flame,
  Wind,
  Flower2,
  TreeDeciduous,
  MessageSquare
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);

  // New review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prod = await dataService.getProductById(id);
        if (prod) {
          setProduct(prod);
          // Fetch reviews
          const revList = await dataService.getReviews(id);
          setReviews(revList);

          // Fetch related
          const allProds = await dataService.getProducts({ family: prod.family });
          setRelatedProducts(allProds.filter(p => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-800 rounded-full animate-spin mb-4" />
        <p className="font-serif text-sage-800">Distilling botanical fragrance...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-3xl text-center border border-sage-200 shadow-soft">
        <h2 className="font-serif text-2xl font-bold text-sage-950">Fragrance Not Found</h2>
        <p className="text-xs text-sage-600 mt-2 mb-6">
          The requested perfume extraction may have concluded its seasonal run.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-sage-900 transition"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const multiplier = SIZE_PRICE_MULTIPLIERS[selectedSize] || 1.0;
  const unitPrice = Math.round(product.price * multiplier);
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async () => {
    if (!user) {
      navigate('/auth', { state: { message: 'Please log in to save items to your wishlist.' } });
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please share your thoughts on this fragrance.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const newRev = await dataService.addReview({
        productId: product.id,
        userId: user?.id || 'guest',
        userName: reviewName.trim() || user?.name || 'Fragrance Enthusiast',
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews(prev => [newRev, ...prev]);
      setReviewComment('');
      setShowReviewForm(false);
    } catch (err) {
      setReviewError('Failed to publish review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Average Rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-sage-500">
        <Link to="/" className="hover:text-sage-800 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-sage-800 transition">Shop</Link>
        <span>/</span>
        <Link to={`/shop?family=${product.family}`} className="hover:text-sage-800 transition">{product.family}</Link>
        <span>/</span>
        <span className="text-sage-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-100 border border-sage-200/80 shadow-soft-lg group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-cream-50/90 text-sage-900 shadow-sm backdrop-blur-sm border border-sage-200">
              {product.family} Olfactory Accord
            </span>
            {product.isFeatured && (
              <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-gold-400 text-sage-950 shadow-sm">
                Master Distillation
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-sage-500 font-bold">
                {product.brand}
              </span>
              <span className="text-xs font-medium text-sage-600 bg-sage-100 px-2.5 py-0.5 rounded-full">
                {product.gender}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sage-950 mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(Number(avgRating)) ? 'fill-current' : 'text-sage-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-sage-800">{avgRating}</span>
              <span className="text-xs text-sage-500">({reviews.length} artisan reviews)</span>
            </div>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3 pb-6 border-b border-sage-200/60">
            <span className="font-serif text-4xl font-bold text-sage-950">
              ${unitPrice}
            </span>
            <span className="text-xs text-sage-500 uppercase tracking-wider font-medium">
              Tax included • Free global delivery over $100
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-sage-700 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Flacon Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-sage-800">
                Select Flacon Volume
              </label>
              <span className="text-xs text-sage-500 italic">
                {selectedSize === '30ml' && 'Compact travel flacon'}
                {selectedSize === '50ml' && 'Standard signature flacon'}
                {selectedSize === '100ml' && 'Collector grand flacon'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['30ml', '50ml', '100ml'].map((sz) => {
                const mult = SIZE_PRICE_MULTIPLIERS[sz];
                const p = Math.round(product.price * mult);
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 px-4 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      selectedSize === sz
                        ? 'border-sage-900 bg-sage-900 text-cream-50 shadow-soft'
                        : 'border-sage-200 bg-white/80 text-sage-800 hover:border-sage-400'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{sz}</span>
                    <span className={`text-xs ${selectedSize === sz ? 'text-gold-300' : 'text-sage-600'}`}>
                      ${p}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-sage-300 rounded-2xl bg-white p-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-sage-700 hover:bg-sage-100 rounded-xl transition text-base font-semibold"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-sage-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-sage-700 hover:bg-sage-100 rounded-xl transition text-base font-semibold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-sage-800 hover:bg-sage-900 active:scale-98 disabled:bg-sage-300 text-cream-50 font-semibold py-4 px-6 rounded-2xl transition shadow-soft flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs"
              >
                <ShoppingBag size={18} />
                <span>{product.stock > 0 ? `Add to Bag • $${unitPrice * quantity}` : 'Out of Stock'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`p-4 rounded-2xl border transition shadow-sm ${
                  wishlisted
                    ? 'bg-blush-400 border-blush-400 text-white shadow-soft'
                    : 'border-sage-200 bg-white text-sage-700 hover:text-blush-500 hover:border-blush-200'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock ({product.stock} units hand-bottled & available in conservatory vault)</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sage-200/60 text-center">
            <div className="space-y-1">
              <Truck size={18} className="mx-auto text-sage-600" />
              <p className="text-[11px] font-semibold text-sage-900">Free Express</p>
              <p className="text-[10px] text-sage-500">Over $100</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck size={18} className="mx-auto text-sage-600" />
              <p className="text-[11px] font-semibold text-sage-900">Authentic Niche</p>
              <p className="text-[10px] text-sage-500">100% Certified</p>
            </div>
            <div className="space-y-1">
              <Sparkles size={18} className="mx-auto text-sage-600" />
              <p className="text-[11px] font-semibold text-sage-900">Complimentary</p>
              <p className="text-[10px] text-sage-500">Discovery Samples</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scent Notes Breakdown (Top, Middle, Base) */}
      <section className="bg-white/80 rounded-3xl p-8 sm:p-12 border border-sage-200/80 shadow-soft">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
            Fragrance Formulation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">
            Olfactory Pyramid Breakdown
          </h2>
          <p className="text-xs text-sage-600 mt-2">
            The precise botanical orchestration composing the evolution of {product.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Notes */}
          <div className="bg-cream-100/70 border border-sage-200/60 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-3">
              <Wind size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-sage-950">Top Notes</h4>
            <p className="text-[11px] uppercase tracking-wider text-sage-500 font-semibold">Immediate Impression</p>
            <p className="text-sm font-medium text-sage-800 pt-1 leading-relaxed">
              {product.notesTop}
            </p>
          </div>

          {/* Heart / Middle Notes */}
          <div className="bg-cream-100/70 border border-sage-200/60 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blush-100 text-blush-600 flex items-center justify-center mx-auto mb-3">
              <Flower2 size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-sage-950">Middle / Heart Notes</h4>
            <p className="text-[11px] uppercase tracking-wider text-sage-500 font-semibold">Soul of the Perfume</p>
            <p className="text-sm font-medium text-sage-800 pt-1 leading-relaxed">
              {product.notesMiddle}
            </p>
          </div>

          {/* Base Notes */}
          <div className="bg-cream-100/70 border border-sage-200/60 rounded-2xl p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-sage-200 text-sage-800 flex items-center justify-center mx-auto mb-3">
              <TreeDeciduous size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-sage-950">Base Notes</h4>
            <p className="text-[11px] uppercase tracking-wider text-sage-500 font-semibold">Enduring Signature Sillage</p>
            <p className="text-sm font-medium text-sage-800 pt-1 leading-relaxed">
              {product.notesBase}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sage-200/80 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950">
              Devotee Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-sage-600 mt-1">Verified notes from our conservatory community</p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center gap-2 bg-cream-200 hover:bg-cream-300 text-sage-900 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition"
          >
            <MessageSquare size={14} />
            {showReviewForm ? 'Cancel Review' : 'Write a Fragrance Review'}
          </button>
        </div>

        {/* Review Form Drawer */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-5 animate-in fade-in"
          >
            <h3 className="font-serif text-lg font-bold text-sage-950">Share Your Olfactory Impression</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-gold-500 hover:scale-110 transition p-1"
                    >
                      <Star
                        size={22}
                        className={star <= reviewRating ? 'fill-current' : 'text-sage-200'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-sage-700 ml-2">{reviewRating} / 5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Your Review
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe how the top, middle, and base notes unfold on your skin, the sillage, and longevity..."
                className="w-full px-4 py-2.5 rounded-xl border border-sage-300 text-xs text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
                required
              />
            </div>

            {reviewError && (
              <p className="text-xs text-blush-500">{reviewError}</p>
            )}

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-sage-800 hover:bg-sage-900 text-cream-50 font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50"
            >
              {submittingReview ? 'Submitting Review...' : 'Publish Fragrance Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white/50 rounded-2xl border border-sage-100">
              <p className="text-xs text-sage-600">Be the first to review this artisanal creation!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white/80 border border-sage-200/70 p-6 rounded-2xl shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-sage-950">{rev.userName}</h4>
                    <p className="text-[10px] text-sage-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rev.rating ? 'fill-current' : 'text-sage-200'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-sage-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Fragrances */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-sage-200/80">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-sage-950">
              More from the {product.family} Collection
            </h2>
            <Link
              to={`/shop?family=${product.family}`}
              className="text-xs font-semibold text-sage-800 hover:text-sage-950 underline underline-offset-4"
            >
              View All {product.family}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
