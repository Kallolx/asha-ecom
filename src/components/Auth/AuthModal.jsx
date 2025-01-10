import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      // More user-friendly error messages
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('An account already exists with this email. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Please use a stronger password (at least 6 characters).');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Unable to sign in with Google. Please try again or use email.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div 
          className="relative bg-white w-full max-w-[95%] sm:max-w-md rounded-xl p-4 sm:p-8 shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-3 sm:right-6 top-3 sm:top-6 text-gray-400 hover:text-[#2B7A0B] transition-colors"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Header with Simplified Message */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              {mode === 'signin' 
                ? "Sign in for a faster checkout experience" 
                : "Join us to start shopping"}
            </p>
          </div>

          {/* Simplified Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors mb-6 text-base sm:text-lg font-medium"
          >
            <FcGoogle className="w-6 h-6 sm:w-7 sm:h-7" />
            <span>Continue with Google Account</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm sm:text-base">
              <span className="px-4 bg-white text-gray-500">or use email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 sm:pl-12 w-full py-3 sm:py-4 px-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent"
                    placeholder="Type your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 sm:pl-12 w-full py-3 sm:py-4 px-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent"
                  placeholder="Type your email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 sm:pl-12 w-full py-3 sm:py-4 px-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B7A0B] focus:border-transparent"
                  placeholder={mode === 'signin' ? "Type your password" : "Create a password"}
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters long</p>
              )}
            </div>

            {/* Mode Toggle Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-[#2B7A0B] hover:underline text-sm sm:text-base"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Create one here" 
                  : "Already have an account? Sign in here"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B7A0B] text-white py-3 sm:py-4 rounded-lg hover:bg-[#236209] transition-colors flex items-center justify-center text-base sm:text-lg font-medium mt-4"
            >
              {loading ? (
                <span className="w-6 h-6 sm:w-7 sm:h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 