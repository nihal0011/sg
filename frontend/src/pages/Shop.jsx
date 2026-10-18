import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as dataService from '../services/dataService';
import ProductCard from '../components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

const FAMILIES = ['All', 'Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh'];
const GENDERS = ['All', 'Unisex', 'Women', 'Men'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedFamily, setSelectedFamily] = useState(searchParams.get('family') || 'All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState('featured');

  // Sync family from URL query params (e.g. from Home or Navbar clicks)
  useEffect(() => {
    const familyFromUrl = searchParams.get('family');
    if (familyFromUrl) {
      setSelectedFamily(familyFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const list = await dataService.getProducts({
          search: searchQuery,
          family: selectedFamily,
          gender: selectedGender,
          sort: sortBy,
          minPrice: 0,
          maxPrice: Number(maxPrice)
        });
        setProducts(list);
      } catch (err) {
        console.error('Failed to load perfumes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [searchQuery, selectedFamily, selectedGender, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFamily('All');
    setSelectedGender('All');
    setMaxPrice(200);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedFamily !== 'All' ||
    selectedGender !== 'All' ||
    maxPrice < 200 ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sage-950">
          The Fragrance Collection
        </h1>
        <p className="text-sm text-sage-700 leading-relaxed">
          Explore botanical extractions, cold-pressed blooms, and sacred resins. Filter by olfactory family, accord or gender.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-sage-200/80 shadow-soft space-y-6">
        {/* Search & Sort row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by perfume, notes (e.g. oud, jasmine), or brand..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full border border-sage-200 bg-cream-50/50 text-xs text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-sage-600 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border border-sage-200 bg-white text-xs font-semibold text-sage-800 focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer shadow-sm"
            >
              <option value="featured">Artisan Choice (Featured)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-sage-100">
          {/* Scent Family Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-2">
              Scent Family
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FAMILIES.map((fam) => (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedFamily.toLowerCase() === fam.toLowerCase()
                      ? 'bg-sage-800 text-cream-50 shadow-sm'
                      : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-2">
              Audience / Gender
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENDERS.map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGender(gen)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedGender.toLowerCase() === gen.toLowerCase()
                      ? 'bg-sage-800 text-cream-50 shadow-sm'
                      : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-sage-700">
                Max Price
              </label>
              <span className="text-xs font-bold text-sage-900 bg-gold-100 px-2 py-0.5 rounded-md">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-gold-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-sage-500 mt-1">
              <span>$90</span>
              <span>$200</span>
            </div>
          </div>
        </div>

        {/* Results Bar & Active Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sage-100 text-xs">
          <div className="text-sage-600 font-medium">
            Showing <span className="font-bold text-sage-950">{products.length}</span> botanical creations
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-blush-600 font-semibold underline underline-offset-4 transition"
            >
              <RotateCcw size={13} />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 bg-sage-100/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-16 text-center border border-sage-200 shadow-soft max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-cream-100 text-sage-400 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={28} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-sage-950">No Fragrances Found</h3>
          <p className="text-xs text-sage-600 leading-relaxed">
            We couldn't find any botanical perfumes matching your current filter selection. Try adjusting your search keywords, scent family, or price ceiling.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-6 py-2.5 rounded-full text-xs uppercase font-semibold hover:bg-sage-900 transition shadow-soft"
          >
            <RotateCcw size={14} /> Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
