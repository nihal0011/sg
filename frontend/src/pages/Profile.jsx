import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ error: true, text: 'Name cannot be empty.' });
      return;
    }
    setProfileLoading(true);
    try {
      await updateProfile({ name });
      setProfileMsg({ error: false, text: 'Profile name successfully updated!' });
    } catch (err) {
      setProfileMsg({ error: true, text: err.message || 'Failed to update name.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ error: true, text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ error: true, text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg({ error: false, text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ error: true, text: err.message || 'Current password was incorrect.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
          Identity & Security
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
          Client Profile Settings
        </h1>
        <p className="text-xs text-sage-600 mt-1">
          Manage your account profile and security credentials.
        </p>
      </div>

      {/* Account Info Pill */}
      <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-sage-800 text-gold-300 flex items-center justify-center font-serif text-2xl font-bold shadow-soft">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="font-serif text-xl font-bold text-sage-950">{user?.name}</h2>
              {user?.role === 'admin' && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-sage-600 font-mono mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-sage-400 mt-1">Member ID: #SCG-{user?.id?.slice(-6)?.toUpperCase()}</p>
          </div>
        </div>

        <div className="bg-cream-100/70 p-4 rounded-2xl border border-sage-200/60 text-xs text-sage-700 max-w-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-sage-900">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Verified Account Protection</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Your credentials and personal fragrance collection are secured with end-to-end cryptographic encryption.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Edit Name Form */}
        <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sage-100">
            <User size={18} className="text-sage-700" />
            <h3 className="font-serif text-lg font-bold text-sage-950">Profile Details</h3>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.error
                  ? 'bg-blush-50 text-blush-700 border border-blush-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {profileMsg.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sage-300 text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Registered Email (Permanent)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sage-200 bg-cream-50 font-mono text-sage-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-sage-800 hover:bg-sage-900 active:scale-98 text-cream-50 font-semibold py-3 px-5 rounded-xl transition shadow-soft text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {profileLoading ? 'Updating Name...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sage-100">
            <KeyRound size={18} className="text-sage-700" />
            <h3 className="font-serif text-lg font-bold text-sage-950">Change Password</h3>
          </div>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.error
                  ? 'bg-blush-50 text-blush-700 border border-blush-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {passwordMsg.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Current Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sage-300 text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                New Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sage-300 text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sage-300 text-sage-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[11px] text-sage-600 hover:text-sage-900 flex items-center gap-1.5"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-sage-800 hover:bg-sage-900 active:scale-98 text-cream-50 font-semibold py-3 px-5 rounded-xl transition shadow-soft text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {passwordLoading ? 'Encrypting...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
