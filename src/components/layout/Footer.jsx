import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">RecipeHub</h3>
            <p className="text-gray-300">
              Discover amazing recipes from around the world. Cook, share, and enjoy delicious meals!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/recipes" className="text-gray-300 hover:text-white transition-colors">Recipes</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/category/breakfast" className="text-gray-300 hover:text-white transition-colors">Breakfast</Link></li>
              <li><Link to="/category/lunch" className="text-gray-300 hover:text-white transition-colors">Lunch</Link></li>
              <li><Link to="/category/dinner" className="text-gray-300 hover:text-white transition-colors">Dinner</Link></li>
              <li><Link to="/category/dessert" className="text-gray-300 hover:text-white transition-colors">Dessert</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Subscribe to our newsletter for weekly recipes
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <FaHeart className="text-red-500 mx-1" />
            <span>by RecipeHub Team © {new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;