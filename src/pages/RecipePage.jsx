import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipeById, addReview, likeRecipe, starRecipe } from '../services/recipeService';
import toast from 'react-hot-toast';
import { 
  FiClock, FiUsers, FiStar, FiHeart, FiShare2, FiChevronLeft, 
  FiEdit2, FiTrash2, FiBookmark, FiPrinter, FiMessageSquare 
} from 'react-icons/fi';
import { FaFire, FaUtensils } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      setError('Recipe not found');
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like recipes');
      return;
    }
    try {
      const result = await likeRecipe(id);
      setRecipe(prev => ({ ...prev, likes: result.likes, liked: result.liked }));
      toast.success(result.liked ? 'Recipe liked!' : 'Recipe unliked');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like recipe');
    }
  };

  const handleStar = async () => {
    if (!user) {
      toast.error('Please login to save recipes');
      return;
    }
    try {
      const result = await starRecipe(id);
      setRecipe(prev => ({ ...prev, stars: result.stars, starred: result.starred }));
      toast.success(result.starred ? 'Recipe saved to favorites!' : 'Recipe removed from favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save recipe');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Recipe link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await addReview(id, review);
      toast.success('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
      fetchRecipe(); // Refresh to show new review
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Skeleton height={400} className="mb-6 rounded-xl" />
          <Skeleton count={5} />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/recipes')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Browse Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6"
      >
        <FiChevronLeft />
        <span>Back to Recipes</span>
      </button>

      {/* Recipe Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        {/* Recipe Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={recipe.image || 'https://via.placeholder.com/1200x600?text=Recipe+Image'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Recipe Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              <span className="px-4 py-1 bg-orange-500 rounded-full text-sm font-semibold">
                {recipe.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <FiClock />
                <span>{recipe.prepTime + recipe.cookTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiUsers />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFire />
                <span>{Math.round((recipe.prepTime + recipe.cookTime) / recipe.servings)} min/serving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Author Info */}
              {recipe.author && (
                <div className="flex items-center space-x-3">
                  <img
                    src={recipe.author.avatar || 'https://via.placeholder.com/40'}
                    alt={recipe.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{recipe.author.name}</p>
                    <p className="text-sm text-gray-500">
                      Posted {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${recipe.liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiHeart className={recipe.liked ? 'fill-current' : ''} />
                <span>{recipe.likes?.length || 0}</span>
              </button>

              {/* Star Button */}
              <button
                onClick={handleStar}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${recipe.starred ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiBookmark className={recipe.starred ? 'fill-current' : ''} />
                <span>{recipe.stars?.length || 0}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                <FiShare2 />
                <span>Share</span>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                <FiPrinter />
                <span>Print</span>
              </button>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex items-center space-x-2 border-l pl-4">
                  <button
                    onClick={() => navigate(`/admin/edit-recipe/${recipe._id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this recipe?')) {
                        // Implement delete
                        toast.success('Delete functionality to be implemented');
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Description */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
        </div>

        {/* Recipe Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiClock className="mr-2" />
              Timing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Prep Time</span>
                <span className="font-semibold">{recipe.prepTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cook Time</span>
                <span className="font-semibold">{recipe.cookTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time</span>
                <span className="font-semibold">{recipe.prepTime + recipe.cookTime} minutes</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUtensils className="mr-2" />
              Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Servings</span>
                <span className="font-semibold">{recipe.servings} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold">{recipe.category}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2" />
              Ratings
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 fill-current" />
                  <span className="ml-1 font-bold">{recipe.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-500 ml-1">/5</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Reviews</span>
                <span className="font-semibold">{recipe.reviews?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Likes</span>
                <span className="font-semibold">{recipe.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions?.map((instruction, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {instruction.step || index + 1}
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">{instruction.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          <div className="flex items-center">
            <FiStar className="text-yellow-500 fill-current" />
            <span className="ml-2 font-bold text-xl">{recipe.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-gray-500 ml-1">({recipe.reviews?.length || 0} reviews)</span>
          </div>
        </div>

        {/* Add Review Form */}
        {user ? (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReview({ ...review, rating: star })}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= review.rating ? (
                        <FiStar className="text-yellow-500 fill-current" />
                      ) : (
                        <FiStar className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Share your thoughts about this recipe..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 mb-2">Please login to leave a review</p>
            <button
              onClick={() => navigate('/login')}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Login Now
            </button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {recipe.reviews && recipe.reviews.length > 0 ? (
            recipe.reviews.map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.user?.avatar || 'https://via.placeholder.com/40'}
                      alt={review.user?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} ml-1`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;