import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiBook, FiMessageSquare, FiUserCheck } from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome /> },
    { to: '/recipes', label: 'Recipes', icon: <FaUtensils /> },
    { to: '/contact', label: 'Contact', icon: <FiMessageSquare /> },
  ];

  if (user) {
    navLinks.push(
      { to: '/profile', label: 'Profile', icon: <FiUser /> }
    );
    if (isAdmin) {
      navLinks.push(
        { to: '/admin', label: 'Admin', icon: <FiUserCheck /> }
      );
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaUtensils className="text-2xl text-orange-500" />
            <span className="text-xl font-bold text-gray-800">RecipeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-orange-500"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 py-2 text-red-500 hover:text-red-600 w-full"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Link
                  to="/login"
                  className="py-2 text-center text-gray-600 hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 text-center bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;