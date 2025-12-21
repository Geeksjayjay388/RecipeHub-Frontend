import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { useRecipe } from '../context/RecipeContext';
import { GiChefToque } from 'react-icons/gi';
import { FiClock, FiStar, FiUsers } from 'react-icons/fi';

const HomePage = () => {
  const { recipes, fetchRecipes } = useRecipe();

  useEffect(() => {
    fetchRecipes({ limit: 8 });
  }, []);

  const featuredRecipes = recipes.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cook Like a Pro</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing recipes from around the world. Easy to follow, delicious to eat!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/recipes"
              className="px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Recipes
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <GiChefToque className="text-3xl text-orange-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800">500+</div>
          <div className="text-gray-600">Recipes</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FiUsers className="text-3xl text-orange-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800">10K+</div>
          <div className="text-gray-600">Community</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FiClock className="text-3xl text-orange-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800">15-30</div>
          <div className="text-gray-600">Avg. Cook Time</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FiStar className="text-3xl text-orange-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-800">4.8</div>
          <div className="text-gray-600">Avg. Rating</div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Recipes</h2>
          <Link to="/recipes" className="text-orange-500 hover:text-orange-600 font-semibold">
            View All →
          </Link>
        </div>
        
        {featuredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map(recipe => (
              <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={recipe.image || 'https://via.placeholder.com/400x300'}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">{recipe.category}</span>
                      <span className="text-sm font-semibold text-orange-500">
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured recipes yet</p>
          </div>
        )}
      </div>

      {/* Main Recipe Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Recipes</h2>
        <RecipeGrid />
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Share Your Recipes</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join our community of food lovers and share your favorite recipes with the world!
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
};

export default HomePage;