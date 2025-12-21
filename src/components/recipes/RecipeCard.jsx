import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaFire, FaStar, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useRecipe } from '../../context/RecipeContext';
import toast from 'react-hot-toast';

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth();
  const { handleLike, handleStar } = useRecipe();

  const handleLikeClick = async () => {
    if (!user) {
      toast.error('Please login to like recipes');
      return;
    }
    try {
      await handleLike(recipe._id);
      toast.success(recipe.liked ? 'Recipe unliked' : 'Recipe liked!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like recipe');
    }
  };

  const handleStarClick = async () => {
    if (!user) {
      toast.error('Please login to save recipes');
      return;
    }
    try {
      await handleStar(recipe._id);
      toast.success(recipe.starred ? 'Recipe removed from favorites' : 'Recipe saved to favorites!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save recipe');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/recipe/${recipe._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={recipe.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
        {recipe.category && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
              {recipe.category}
            </span>
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-6">
        <Link to={`/recipe/${recipe._id}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-orange-500 transition-colors mb-2 line-clamp-1">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <FaClock />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <FaFire />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-yellow-500">
            <FaStar />
            <span className="font-semibold">{recipe.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        {/* Author */}
        {recipe.author && (
          <div className="flex items-center mb-4">
            <img
              src={recipe.author.avatar || 'https://via.placeholder.com/32'}
              alt={recipe.author.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-gray-600 text-sm">{recipe.author.name}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-3">
            <button
              onClick={handleLikeClick}
              className={`flex items-center space-x-1 ${recipe.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <FaHeart />
              <span>{recipe.likes?.length || 0}</span>
            </button>
            
            <button
              onClick={handleStarClick}
              className={`flex items-center space-x-1 ${recipe.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <FaStar />
              <span>{recipe.stars?.length || 0}</span>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-orange-500"
            >
              <FaShareAlt />
            </button>
            
            <Link
              to={`/recipe/${recipe._id}`}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              View Recipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;