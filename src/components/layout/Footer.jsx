import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaGithub, 
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaApple,
  FaGooglePlay
} from 'react-icons/fa';
import { TbChefHat } from 'react-icons/tb';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    explore: [
      { name: 'Home', path: '/' },
      { name: 'All Recipes', path: '/recipes' },
      { name: 'Categories', path: '/categories' },
      { name: 'Popular Recipes', path: '/popular' },
      { name: 'New Arrivals', path: '/new' }
    ],
    categories: [
      { name: 'Breakfast', path: '/category/breakfast' },
      { name: 'Lunch', path: '/category/lunch' },
      { name: 'Dinner', path: '/category/dinner' },
      { name: 'Dessert', path: '/category/dessert' },
      { name: 'Quick Meals', path: '/category/quick' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press Kit', path: '/press' },
      { name: 'Partnerships', path: '/partnerships' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'DMCA', path: '/dmca' }
    ]
  };

  const socialLinks = [
    { icon: FaFacebook, url: '#', color: 'hover:bg-blue-600', name: 'Facebook' },
    { icon: FaTwitter, url: '#', color: 'hover:bg-sky-500', name: 'Twitter' },
    { icon: FaInstagram, url: '#', color: 'hover:bg-pink-600', name: 'Instagram' },
    { icon: FaGithub, url: '#', color: 'hover:bg-gray-900', name: 'GitHub' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white mt-20 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                Join Our Culinary Community! 🍳
              </h3>
              <p className="text-orange-50 text-lg">
                Get exclusive recipes, cooking tips, and special offers delivered to your inbox every week.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-full bg-amber-50 text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-300 pr-32"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all"
                >
                  <span>Subscribe</span>
                  <FaArrowRight />
                </button>
              </form>
              {subscribed && (
                <p className="mt-3 text-orange-100 font-semibold animate-pulse">
                  ✓ Successfully subscribed! Check your inbox.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <TbChefHat className="text-3xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  RecipeHub
                </h3>
                <p className="text-xs text-gray-400">Taste the World</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your ultimate destination for discovering, sharing, and mastering recipes from around the globe. Join thousands of food lovers today!
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="text-orange-500" />
                <span>hello@recipehub.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaPhone className="text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaMapMarkerAlt className="text-orange-500" />
                <span>123 Culinary Street, Food City, FC 12345</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Legal</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Downloads */}
            <div className="space-y-2">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors w-full">
                <FaApple className="text-xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors w-full">
                <FaGooglePlay className="text-xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 font-semibold mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-800 ${social.color} p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                  aria-label={social.name}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© {new Date().getFullYear()} RecipeHub. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <span className="hidden md:inline">Crafted with</span>
                <FaHeart className="text-red-500 animate-pulse" />
                <span className="hidden md:inline">by RecipeHub Team</span>
              </span>
            </div>

            {/* Language Selector */}
            <select className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scroll to top indicator - appears when scrolling */}
      <div className="absolute bottom-8 right-8">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
          aria-label="Scroll to top"
        >
          <FaArrowRight className="text-xl rotate-[-90deg] group-hover:animate-bounce" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;