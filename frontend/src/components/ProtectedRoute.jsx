import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-800 rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif text-sage-700">Verifying botanical session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-blush-200 text-center shadow-soft">
        <div className="w-16 h-16 bg-blush-100 text-blush-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-sage-950">Restricted Curator Access</h2>
        <p className="text-sm text-sage-600 mt-2 mb-6">
          This portal is reserved strictly for Botanical Administrators. Please log in with the administrator account (<code className="bg-sage-100 px-2 py-0.5 rounded text-sage-900 font-semibold">admin@scentgarden.com</code>).
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-sage-800 text-cream-50 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sage-900 transition"
        >
          Return Back
        </button>
      </div>
    );
  }

  return children;
}
