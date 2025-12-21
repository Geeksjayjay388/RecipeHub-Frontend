import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecipeById, addReview } from '../../services/recipeService';
import toast from 'react-hot-toast';
import { 
  FiClock, FiUsers, FiStar, FiHeart, FiShare2, 
  FiEdit2, FiTrash2, FiBookmark, FiPrinter, FiMessageSquare,
  FiShoppingCart, FiCopy, FiChevronDown, FiChevronUp,
  FiExternalLink, FiCamera
} from 'react-icons/fi';
import { FaFire, FaUtensils, FaRegCommentDots } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

const RecipeDetail = ({ recipe, onLike, onStar, onShare, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);

  if (!recipe) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton height={400} className="mb-6 rounded-xl" />
        <Skeleton count={5} />
      </div>
    );
  }

  const handleAddToShoppingList = () => {
    const newList = [...shoppingList, ...recipe.ingredients.filter(item => !shoppingList.includes(item))];
    setShoppingList(newList);
    localStorage.setItem('shoppingList', JSON.stringify(newList));
    toast.success('Added to shopping list!');
  };

  const handleCopyIngredients = () => {
    const ingredientsText = recipe.ingredients.join('\n');
    navigator.clipboard.writeText(ingredientsText);
    toast.success('Ingredients copied to clipboard!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await addReview(recipe._id, review);
      toast.success('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
      // Refresh recipe data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  const caloriesPerServing = Math.round((totalTime * 5) + (recipe.servings * 20)); // Mock calculation

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6"
      >
        <FiExternalLink className="rotate-180" />
        <span>Back to Recipes</span>
      </button>

      {/* Recipe Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        {/* Recipe Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Recipe Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              <span className="px-4 py-2 bg-orange-500 border border-orange-600 rounded-full text-sm font-semibold">
                {recipe.category}
              </span>
              {recipe.vegetarian && (
                <span className="px-4 py-2 bg-green-500 border border-green-600 rounded-full text-sm font-semibold">
                  Vegetarian
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full">
                <FiClock />
                <span>{totalTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full">
                <FiUsers />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full">
                <FaFire />
                <span>~{caloriesPerServing} cal/serving</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-6 right-6 flex flex-col space-y-3">
            <button
              onClick={() => onLike && onLike(recipe)}
              className={`p-3 rounded-full ${recipe.liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-800 hover:bg-white'}`}
              title={recipe.liked ? 'Unlike' : 'Like'}
            >
              <FiHeart className={recipe.liked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => onStar && onStar(recipe)}
              className={`p-3 rounded-full ${recipe.starred ? 'bg-yellow-500 text-white' : 'bg-white/90 text-gray-800 hover:bg-white'}`}
              title={recipe.starred ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiBookmark className={recipe.starred ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => onShare && onShare(recipe)}
              className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white"
              title="Share"
            >
              <FiShare2 />
            </button>
            <button
              onClick={() => window.print()}
              className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white"
              title="Print"
            >
              <FiPrinter />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b">
          <div className="p-6 text-center border-r">
            <div className="text-2xl font-bold text-gray-800">{recipe.prepTime}</div>
            <div className="text-gray-600 text-sm">Prep Time</div>
          </div>
          <div className="p-6 text-center border-r">
            <div className="text-2xl font-bold text-gray-800">{recipe.cookTime}</div>
            <div className="text-gray-600 text-sm">Cook Time</div>
          </div>
          <div className="p-6 text-center border-r">
            <div className="text-2xl font-bold text-gray-800">{recipe.servings}</div>
            <div className="text-gray-600 text-sm">Servings</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-800">{recipe.averageRating?.toFixed(1) || '0.0'}</div>
            <div className="text-gray-600 text-sm">Rating</div>
          </div>
        </div>

        {/* Author & Actions */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Author Info */}
            {recipe.author && (
              <div className="flex items-center space-x-4">
                <img
                  src={recipe.author.avatar || `https://ui-avatars.com/api/?name=${recipe.author.name}&background=ff6b35&color=fff`}
                  alt={recipe.author.name}
                  className="w-14 h-14 rounded-full border-2 border-orange-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">{recipe.author.name}</p>
                  <p className="text-sm text-gray-500">
                    Posted {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToShoppingList}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FiShoppingCart />
                <span>Shopping List</span>
              </button>
              
              <button
                onClick={handleCopyIngredients}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FiCopy />
                <span>Copy Ingredients</span>
              </button>

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate(`/admin/edit-recipe/${recipe._id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(recipe)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUtensils className="mr-3 text-orange-500" />
            About This Recipe
          </h2>
          <div className="text-gray-700 leading-relaxed">
            {showFullDescription ? recipe.description : `${recipe.description.substring(0, 300)}...`}
            {recipe.description.length > 300 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="ml-2 text-orange-500 hover:text-orange-600 font-semibold"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
                {showFullDescription ? <FiChevronUp className="inline ml-1" /> : <FiChevronDown className="inline ml-1" />}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {['ingredients', 'instructions', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Ingredients Tab */}
          {activeTab === 'ingredients' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Ingredients</h3>
                <ul className="space-y-4">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 border-2 border-orange-500 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{ingredient}</span>
                      <button className="ml-auto text-gray-400 hover:text-orange-500">
                        <FiShoppingCart />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Shopping List</h3>
                {shoppingList.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ul className="space-y-3">
                      {shoppingList.map((item, index) => (
                        <li key={index} className="flex items-center justify-between p-2">
                          <span className="text-gray-700">{item}</span>
                          <button
                            onClick={() => {
                              const newList = shoppingList.filter((_, i) => i !== index);
                              setShoppingList(newList);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shoppingList.join('\n'));
                          toast.success('Shopping list copied!');
                        }}
                        className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                      >
                        Copy All
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <FiShoppingCart className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your shopping list is empty</p>
                    <p className="text-sm text-gray-400 mt-1">Add ingredients from this recipe</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions Tab */}
          {activeTab === 'instructions' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Step-by-Step Instructions</h3>
                <div className="space-y-6">
                  {recipe.instructions?.map((instruction, index) => (
                    <div key={index} className="flex space-x-6 group">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                          {instruction.step || index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-gray-700 leading-relaxed">{instruction.text}</p>
                        {instruction.image && (
                          <div className="mt-4">
                            <img
                              src={instruction.image}
                              alt={`Step ${instruction.step || index + 1}`}
                              className="rounded-lg max-w-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-50 rounded-xl p-6 mt-8">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <FiMessageSquare className="mr-2" />
                  Chef's Tips
                </h4>
                <ul className="space-y-2 text-blue-700">
                  <li>• Let the dish rest for 5 minutes before serving for better flavor</li>
                  <li>• Use fresh herbs for maximum aroma</li>
                  <li>• Adjust seasoning to your personal taste</li>
                </ul>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Nutrition Facts</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Calories</span>
                      <span className="font-semibold">{caloriesPerServing} kcal</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-semibold">{Math.round(caloriesPerServing * 0.15 / 4)}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Carbohydrates</span>
                      <span className="font-semibold">{Math.round(caloriesPerServing * 0.5 / 4)}g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-semibold">{Math.round(caloriesPerServing * 0.35 / 9)}g</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Fiber</span>
                      <span className="font-semibold">{Math.round(caloriesPerServing * 0.1 / 4)}g</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Dietary Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold">Vegetarian Friendly</p>
                      <p className="text-sm text-gray-600">No meat products used</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4">
                      !
                    </div>
                    <div>
                      <p className="font-semibold">Contains Dairy</p>
                      <p className="text-sm text-gray-600">May contain milk products</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      ⚡
                    </div>
                    <div>
                      <p className="font-semibold">Quick & Easy</p>
                      <p className="text-sm text-gray-600">Under 30 minutes prep time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Reviews & Ratings</h3>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${i < Math.floor(recipe.averageRating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'} ml-1`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold">{recipe.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-500 ml-1">({recipe.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
                
                <button
                  onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                >
                  Write a Review
                </button>
              </div>

              {/* Add Review Form */}
              <div id="review-form" className="mb-12">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Your Review</h4>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-3">Your Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReview({ ...review, rating: star })}
                            className="text-3xl focus:outline-none transform hover:scale-110 transition-transform"
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
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-3">Your Review</label>
                      <textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Share your experience with this recipe..."
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </span>
                        ) : (
                          'Submit Review'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <FaRegCommentDots className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Please login to leave a review</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                    >
                      Login Now
                    </button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-6">All Reviews</h4>
                {recipe.reviews && recipe.reviews.length > 0 ? (
                  <div className="space-y-8">
                    {recipe.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-8 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name}&background=ff6b35&color=fff`}
                              alt={review.user?.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} ml-1`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Recipes & Social Share */}
        <div className="p-8 border-t bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Share this recipe</h4>
              <div className="flex space-x-3">
                <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600">
                  f
                </button>
                <button className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500">
                  t
                </button>
                <button className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                  P
                </button>
                <button
                  onClick={() => onShare && onShare(recipe)}
                  className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 mb-2">Found this recipe helpful?</p>
              <div className="flex items-center justify-center md:justify-end space-x-4">
                <button
                  onClick={() => onLike && onLike(recipe)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${recipe.liked ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                >
                  <FiHeart className={recipe.liked ? 'fill-current' : ''} />
                  <span>{recipe.likes?.length || 0} Likes</span>
                </button>
                <button
                  onClick={() => onStar && onStar(recipe)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${recipe.starred ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                >
                  <FiBookmark className={recipe.starred ? 'fill-current' : ''} />
                  <span>Save Recipe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Disclaimer */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl text-sm text-gray-500">
        <p className="text-center">
          <strong>Note:</strong> Nutritional information is estimated based on the ingredients used. 
          For exact nutritional values, please consult a nutritionist or use a nutrition calculator with your specific ingredients.
        </p>
      </div>
    </div>
  );
};

export default RecipeDetail;