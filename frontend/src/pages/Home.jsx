import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as dataService from '../services/dataService';
import ProductCard from '../components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  Droplets,
  Flower2,
  TreeDeciduous,
  Sun,
  Flame,
  Wind,
  CheckCircle2,
  Star,
  Quote
} from 'lucide-react';

const SCENT_FAMILIES = [
  {
    name: 'Floral',
    icon: Flower2,
    tagline: 'Damask Rose, Night Jasmine & Tuberose',
    description: 'Sensual, intoxicating blossoms gathered at first dawn.',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    color: 'from-pink-900/60 to-sage-950/80'
  },
  {
    name: 'Woody',
    icon: TreeDeciduous,
    tagline: 'Sacred Sandalwood, Cedar & Smoky Oud',
    description: 'Grounding, meditative woods steeped in ancient forest moss.',
    bgImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-950/60 to-sage-950/80'
  },
  {
    name: 'Citrus',
    icon: Sun,
    tagline: 'Amalfi Lemon, Calabrian Bergamot & Neroli',
    description: 'Sun-drenched Mediterranean coastal orchards radiant with vitality.',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    color: 'from-yellow-950/60 to-sage-950/80'
  },
  {
    name: 'Oriental',
    icon: Flame,
    tagline: 'Ambergris, Saffron Threads & Bourbon Vanilla',
    description: 'Opulent, seductive warmth glowing with golden nocturnal resins.',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-950/60 to-sage-950/80'
  },
  {
    name: 'Fresh',
    icon: Wind,
    tagline: 'Wild Fig Leaf, Mountain Mint & Dewdrops',
    description: 'Crisp aquatic greens and cool morning mist kissing mountain rivers.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-950/60 to-sage-950/80'
  }
];

const TESTIMONIALS = [
  {
    quote: "Velvet Rose & Oud is an extraordinary olfactory masterpiece. The depth of the smoky agarwood combined with damask petals lingered on my cashmere scarf for days.",
    author: "Genevieve Moreau",
    title: "Fragrance Columnist, Paris",
    rating: 5
  },
  {
    quote: "Finding true artisanal botanical perfumery without synthetics is nearly impossible today. Scent Garden's Santal Enclave is pure poetry.",
    author: "Dr. Alistair Sterling",
    title: "Botanical Historian",
    rating: 5
  },
  {
    quote: "The discovery experience and remarkable sillage made me an instant devotee. Neroli Soleil is pure Mediterranean sunshine captured in glass.",
    author: "Camille Laurent",
    title: "Niche Perfume Collector",
    rating: 5
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const prods = await dataService.getFeaturedProducts(4);
        setFeaturedProducts(prods);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setNewsletterError('Please provide a valid email address.');
      return;
    }
    try {
      await dataService.subscribeNewsletter(emailInput);
      setNewsletterSubscribed(true);
      setNewsletterError('');
      setEmailInput('');
    } catch (err) {
      setNewsletterError('Failed to save subscription. Please try again.');
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8">
        {/* Background Layer with Botanical Image & Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=2000&q=85"
            alt="Botanical perfume laboratory and greenhouse flora"
            className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.1] scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-sage-950/40 to-sage-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 py-16">
          <div className="inline-flex items-center gap-2 bg-cream-50/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-300/30 text-gold-200 text-xs tracking-widest uppercase font-semibold">
            <Sparkles size={14} className="text-gold-400" />
            <span>Pure Botanical Essences & Rare Extractions</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-cream-50 tracking-tight leading-[1.1]">
            Where Earth’s Untamed Scents <br />
            <span className="italic font-serif font-normal text-gold-300">Become Pure Poetry</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-cream-100/90 font-light leading-relaxed">
            Handcrafted natural perfumery inspired by ancient gardens, midnight florals, and sun-warmed resins.
            Created in micro-batches with uncompromised integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold-400 hover:bg-gold-500 text-sage-950 font-semibold px-8 py-4 rounded-full text-sm uppercase tracking-wider transition-all duration-300 shadow-glow-gold hover:scale-105"
            >
              <span>Explore The Collection</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop?family=Floral"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 border border-cream-50/30 font-medium px-8 py-4 rounded-full text-sm uppercase tracking-wider backdrop-blur-sm transition-all"
            >
              <span>Discover Florals</span>
            </Link>
          </div>

          {/* Micro metrics */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-cream-50/15 max-w-lg mx-auto text-cream-100">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-cream-200/70">Botanical Oils</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">6 Weeks</div>
              <div className="text-[11px] uppercase tracking-wider text-cream-200/70">Maceration</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">0%</div>
              <div className="text-[11px] uppercase tracking-wider text-cream-200/70">Phthalates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scent Family Taxonomy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block">
            Olfactory Landscapes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
            Shop by Scent Family
          </h2>
          <p className="text-sm text-sage-700 leading-relaxed">
            Every fragrance begins with an accord. Traverse our five sacred botanical families to discover the chord that speaks to your spirit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SCENT_FAMILIES.map((family) => {
            const Icon = family.icon;
            return (
              <Link
                key={family.name}
                to={`/shop?family=${family.name}`}
                className="group relative h-80 rounded-2xl overflow-hidden border border-sage-200/60 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-end p-5"
              >
                {/* Background image */}
                <img
                  src={family.bgImage}
                  alt={family.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Dark botanical gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${family.color} transition-opacity duration-300 group-hover:opacity-90`} />

                {/* Content */}
                <div className="relative z-10 text-cream-50 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cream-50/20 backdrop-blur-md flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-cream-50 group-hover:text-gold-200 transition-colors">
                    {family.name}
                  </h3>
                  <p className="text-xs text-cream-200/90 line-clamp-2 leading-relaxed">
                    {family.tagline}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-gold-300 font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Artisanal Perfumes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-2">
              Curator’s Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
              Featured Fragrances
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sage-800 hover:text-sage-950 transition group"
          >
            <span>View All Botanical Creations</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 bg-sage-100/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Scent Architecture Education Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sage-900 text-cream-50 rounded-3xl p-8 sm:p-14 border border-sage-800 shadow-2xl relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-sage-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold-400 block mb-2">
              The Alchemy of Sillage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
              Understanding the Olfactory Pyramid
            </h2>
            <p className="text-sm text-sage-300 mt-3 leading-relaxed">
              Natural perfume is alive. It unfolds like a blooming flower across hours, evolving with your personal skin chemistry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Top Notes */}
            <div className="bg-sage-800/60 border border-sage-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-sm">
              <div className="text-gold-400 font-serif text-3xl font-light">01</div>
              <h3 className="font-serif text-lg font-bold text-cream-50">Top Notes</h3>
              <p className="text-xs uppercase tracking-wider text-sage-400 font-semibold">
                First 15 Minutes
              </p>
              <p className="text-xs text-sage-300 leading-relaxed">
                The initial awakening of the senses. Citrus zests, crisp herbs, and radiant pink peppercorns that burst upon first mist.
              </p>
            </div>

            {/* Heart Notes */}
            <div className="bg-sage-800/60 border border-sage-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-sm">
              <div className="text-gold-400 font-serif text-3xl font-light">02</div>
              <h3 className="font-serif text-lg font-bold text-cream-50">Heart Notes</h3>
              <p className="text-xs uppercase tracking-wider text-sage-400 font-semibold">
                30 Minutes to 4 Hours
              </p>
              <p className="text-xs text-sage-300 leading-relaxed">
                The soulful core of the fragrance. Lush petals, Damask roses, night-blooming jasmine, and spicy cardamom accords.
              </p>
            </div>

            {/* Base Notes */}
            <div className="bg-sage-800/60 border border-sage-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-sm">
              <div className="text-gold-400 font-serif text-3xl font-light">03</div>
              <h3 className="font-serif text-lg font-bold text-cream-50">Base Notes</h3>
              <p className="text-xs uppercase tracking-wider text-sage-400 font-semibold">
                4 to 24+ Hours
              </p>
              <p className="text-xs text-sage-300 leading-relaxed">
                The lasting memory and emotional anchor. Precious sandalwood, rich smoky agarwood, mineral ambergris, and sweet vanilla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
            Adored by Fragrance Devotees
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-sage-200/70 p-8 rounded-3xl shadow-soft flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-gold-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm text-sage-800 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-6 border-t border-sage-100 mt-6">
                <h4 className="font-serif text-sm font-bold text-sage-950">{t.author}</h4>
                <p className="text-xs text-sage-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botanical Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-100 border border-gold-300/40 rounded-3xl p-8 sm:p-12 text-center shadow-soft relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-gold-400/20 text-gold-600 mx-auto mb-4 flex items-center justify-center">
            <Droplets size={24} />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950 mb-3">
            Join the Botanical Conservatory
          </h2>
          <p className="text-xs sm:text-sm text-sage-700 max-w-xl mx-auto leading-relaxed mb-6">
            Receive private release dates for seasonal micro-batches, botanical distillation essays, and exclusive private offerings.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-sage-800 text-cream-50 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 animate-in fade-in">
              <CheckCircle2 size={20} className="text-gold-400" />
              <span className="text-xs font-semibold">Welcome to our conservatory circle. You will receive private release announcements.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-full border border-sage-300 bg-white text-xs text-sage-900 focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-sage-900 hover:bg-sage-950 text-cream-50 font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition shadow-soft shrink-0"
                >
                  Subscribe
                </button>
              </div>
              {newsletterError && (
                <p className="text-xs text-blush-500 text-left pl-3">{newsletterError}</p>
              )}
              <p className="text-[11px] text-sage-500">
                Exclusive previews and private small-batch offerings only. Never shared with third parties.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
