import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiUsers } from 'react-icons/fi';
import { TbChefHat } from 'react-icons/tb';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      toast.success('Registration successful! Welcome to RecipeHub!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Food Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-orange-200/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 40}px`
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              <TbChefHat />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            {/* Logo & Brand */}
            <div>
              <motion.div 
                className="inline-flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FiUserPlus className="text-4xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    RecipeHub
                  </h1>
                  <p className="text-sm text-gray-600">Join Our Culinary Community</p>
                </div>
              </motion.div>
              
              <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Start Your Culinary Journey
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of passionate home chefs and unlock a world of flavors
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                'Access 10,000+ premium recipes',
                'Create and share your own recipes',
                'Save favorite recipes to collections',
                'Get personalized cooking recommendations',
                'Join cooking challenges and events',
                'Connect with food lovers worldwide'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiCheck className="text-white text-sm" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              {[
                { value: '10K+', label: 'Recipes', icon: <TbChefHat className="w-5 h-5" /> },
                { value: '50K+', label: 'Chefs', icon: <FiUsers className="w-5 h-5" /> },
                { value: '4.9★', label: 'Rating', icon: <FiCheck className="w-5 h-5" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <div className="text-orange-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 backdrop-blur-lg bg-opacity-95 border border-white/20">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <FiUserPlus className="text-3xl text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  RecipeHub
                </span>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h3>
              <p className="text-gray-600">Join our community of passionate home chefs</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-5 h-5 mt-1 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">Or sign up with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium group-hover:text-gray-900">Google</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700 font-medium group-hover:text-gray-900">Facebook</span>
              </motion.button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <FiCheck className="text-green-500" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-green-500" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-green-500" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(251, 146, 60, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 146, 60, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Register;