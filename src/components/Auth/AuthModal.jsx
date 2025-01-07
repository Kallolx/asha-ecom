import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        onClose();
      } else {
        await signUp(formData.email, formData.password, formData.name);
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg w-full max-w-md p-8 shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-primary transition-colors"
          >
            <FiX size={24} />
          </button>

          {/* Mode Toggle */}
          <div className="flex gap-8 mb-8 justify-center">
            <button
              onClick={() => setMode('signin')}
              className={`text-lg font-medium pb-2 px-2 transition-all border-b-2 ${
                mode === 'signin'
                  ? 'text-primary border-primary'
                  : 'text-gray-400 border-transparent hover:text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`text-lg font-medium pb-2 px-2 transition-all border-b-2 ${
                mode === 'signup'
                  ? 'text-primary border-primary'
                  : 'text-gray-400 border-transparent hover:text-primary'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {mode === 'signin' 
                ? "Sign in to continue shopping" 
                : "Join us for a better shopping experience"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-11 w-full h-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 w-full h-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 pr-11 w-full h-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {mode === 'signin' && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {/* Alternative Sign In */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <button
              onClick={() => toast.error('Phone authentication coming soon!')}
              className="mt-4 w-full h-12 flex items-center justify-center gap-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-medium"
            >
              <FiPhone className="text-gray-500" />
              <span>Continue with Phone</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 