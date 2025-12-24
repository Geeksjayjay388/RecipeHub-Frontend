import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiHome, 
  FiBook, 
  FiMessageSquare, 
  FiUserCheck,
  FiChevronDown,
  FiSettings,
  FiHeart,
  FiSearch
} from 'react-icons/fi';
import { TbChefHat } from 'react-icons/tb';
import { FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


// DEBUG - Add this
console.log('👤 USER IN NAVBAR:', user);
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/recipes', label: 'Recipes', icon: FaUtensils },
    { to: '/contact', label: 'Contact', icon: FiMessageSquare },
  ];

  const userMenuLinks = [
    { to: '/profile', label: 'My Profile', icon: FiUser },
    { to: '/favorites', label: 'Favorites', icon: FiHeart },
    { to: '/settings', label: 'Settings', icon: FiSettings },
  ];

  if (isAdmin) {
    userMenuLinks.push(
      { to: '/admin', label: 'Admin Dashboard', icon: FiUserCheck }
    );
  }

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <TbChefHat className="text-2xl text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  RecipeHub
                </span>
                <p className="text-xs text-gray-500 -mt-1">Taste the World</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 group ${
                      isActive 
                        ? 'text-orange-600' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-orange-600' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full px-4 py-2 pl-10 pr-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </form>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Member'}</p>
                    </div>
                    <FiChevronDown className={`text-gray-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white">
                          <p className="font-semibold">{user?.name || 'User'}</p>
                          <p className="text-sm opacity-90">{user?.email || ''}</p>
                        </div>
                        <div className="py-2">
                          {userMenuLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Icon className="text-lg" />
                                <span>{link.label}</span>
                              </Link>
                            );
                          })}
                          <div className="border-t border-gray-100 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <FiLogOut className="text-lg" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only shown when menu is open */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20 lg:h-20"></div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          {/* Mobile Menu Content */}
          <div className="absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-lg animate-slideDown">
            <div className="container mx-auto px-4 py-4">
              {/* User Info (Mobile) */}
              {user && (
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-600">{isAdmin ? 'Admin' : 'Member'}</p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="text-xl" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* User Menu Links (Mobile) */}
                {user && (
                  <>
                    <div className="border-t border-gray-200 my-3"></div>
                    {userMenuLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="text-xl" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Auth Buttons (Mobile) */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full mt-4 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-3 mt-4">
                  <Link
                    to="/login"
                    className="px-4 py-3 text-center text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 text-center bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;