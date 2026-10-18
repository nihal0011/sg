import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, HeartHandshake, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sage-950 text-cream-100 pt-16 pb-12 border-t border-sage-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Botanical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-sage-800/80 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-900 border border-sage-700/60 flex items-center justify-center text-gold-400 shrink-0 mx-auto md:mx-0">
              <Leaf size={22} />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-cream-50">100% Wild Botanicals</h4>
              <p className="text-xs text-sage-300 mt-1 leading-relaxed">
                Cold-pressed petals, sustainably harvested resins, and organic grain spirits. No synthetic phthalates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-900 border border-sage-700/60 flex items-center justify-center text-gold-400 shrink-0 mx-auto md:mx-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-cream-50">Pure Organic Integrity</h4>
              <p className="text-xs text-sage-300 mt-1 leading-relaxed">
                Zero synthetic phthalates, parabens, or chemical fixatives. Only certified botanical extractions and grain spirits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-900 border border-sage-700/60 flex items-center justify-center text-gold-400 shrink-0 mx-auto md:mx-0">
              <HeartHandshake size={22} />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-cream-50">Artisan Craftsmanship</h4>
              <p className="text-xs text-sage-300 mt-1 leading-relaxed">
                Matured for six weeks in French glass carboys before hand-pouring and wax sealing in micro batches.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">Scent Garden</span>
            </div>
            <p className="text-xs text-sage-300 leading-relaxed">
              An olfactory sanctuary honoring the untamed poetry of ancient groves, blooming midnight gardens, and golden resins.
            </p>
            <div className="pt-2 text-xs text-gold-400/90 font-mono">
              Designed for luxury perfumery connoisseurs.
            </div>
          </div>

          {/* Column 2: Scent Families */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4">
              Scent Families
            </h5>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li>
                <Link to="/shop?family=Floral" className="hover:text-gold-300 transition">
                  Floral • Rose, Jasmine, Gardenia
                </Link>
              </li>
              <li>
                <Link to="/shop?family=Woody" className="hover:text-gold-300 transition">
                  Woody • Sandalwood, Cedar, Vetiver
                </Link>
              </li>
              <li>
                <Link to="/shop?family=Citrus" className="hover:text-gold-300 transition">
                  Citrus • Neroli, Bergamot, Lemon
                </Link>
              </li>
              <li>
                <Link to="/shop?family=Oriental" className="hover:text-gold-300 transition">
                  Oriental • Amber, Cardamom, Vanilla
                </Link>
              </li>
              <li>
                <Link to="/shop?family=Fresh" className="hover:text-gold-300 transition">
                  Fresh • Mint, Fig, Rain Accord
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Sanctuary */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li>
                <Link to="/shop" className="hover:text-gold-300 transition">
                  Complete Catalog
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-gold-300 transition">
                  Saved Fragrances
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-gold-300 transition">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-gold-300 transition">
                  Client Account Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Concierge */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider mb-4">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li>
                <span className="text-cream-100 font-medium">Bespoke Consultations</span>
              </li>
              <li>
                <span className="text-cream-100 font-medium">Complimentary Global Delivery</span>
              </li>
              <li>
                <span className="text-cream-100 font-medium">Signature Wax-Sealed Packaging</span>
              </li>
              <li>
                <span className="text-cream-100 font-medium">Artisanal Small-Batch Integrity</span>
              </li>
            </ul>
            <div className="pt-3 text-xs text-gold-400 font-medium">
              concierge@scentgarden.com
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-sage-900 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-400 gap-4">
          <p>© {new Date().getFullYear()} Scent Garden Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>256-Bit SSL Encryption</span>
            <span>Artisanal Certified</span>
            <span>Carbon-Neutral Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
