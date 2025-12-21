import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, updateRecipe } from '../../services/recipeService';
import toast from 'react-hot-toast';
import { 
  FiUpload, FiX, FiPlus, FiMinus, FiSave, FiArrowLeft,
  FiClock, FiUsers, FiBook, FiAlertCircle 
} from 'react-icons/fi';
import { TbChefHat } from 'react-icons/tb';

const CreateRecipeForm = ({ recipe = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
        title: recipe?.title || '',
        description: recipe?.description || '',
        category: recipe?.category || 'Main Course',
        difficulty: recipe?.difficulty || 'Medium',
        prepTime: recipe?.prepTime || '',
        cookTime: recipe?.cookTime || '',
        servings: recipe?.servings || '',
        ingredients: recipe?.ingredients || [''],
        instructions: recipe?.instructions || [''],
        image: recipe?.image || null,
        tags: recipe?.tags || []
        });
React.useEffect(() => {
  if (recipe?.image) {
    setImagePreview(recipe.image);
  }
}, [recipe]);
  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Appetizer', 
    'Main Course', 'Side Dish', 'Snack', 'Beverage', 'Salad'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const popularTags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb',
    'Keto', 'Paleo', 'Quick', 'Healthy', 'Comfort Food'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a recipe title');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }
    if (!formData.prepTime || !formData.cookTime || !formData.servings) {
      toast.error('Please fill in all time and serving information');
      return false;
    }
    if (formData.ingredients.filter(i => i.trim()).length === 0) {
      toast.error('Please add at least one ingredient');
      return false;
    }
    if (formData.instructions.filter(i => i.trim()).length === 0) {
      toast.error('Please add at least one instruction step');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  try {  // ← YOU WERE MISSING THIS!
    setLoading(true);
    
    const recipeData = new FormData();
    recipeData.append('title', formData.title);
    recipeData.append('description', formData.description);
    recipeData.append('category', formData.category);
    recipeData.append('difficulty', formData.difficulty);
    recipeData.append('prepTime', formData.prepTime);
    recipeData.append('cookTime', formData.cookTime);
    recipeData.append('servings', formData.servings);
    recipeData.append('ingredients', JSON.stringify(formData.ingredients.filter(i => i.trim())));
    recipeData.append('instructions', JSON.stringify(formData.instructions.filter(i => i.trim())));
    recipeData.append('tags', JSON.stringify(formData.tags));
    
    if (formData.image) {
      recipeData.append('image', formData.image);
    }

    if (recipe) {
      // UPDATE existing recipe
      await updateRecipe(recipe._id, recipeData);
      toast.success(' Recipe updated successfully!');
    } else {
      // CREATE new recipe
      await createRecipe(recipeData);
      toast.success(' Recipe created successfully!');
    }
    
    navigate('/admin');
  } catch (error) {  // ← NOW THIS WORKS!
    console.error('Error saving recipe:', error);
    toast.error(error.response?.data?.message || `Failed to ${recipe ? 'update' : 'create'} recipe`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            <p className="text-gray-600">
            {recipe ? 'Update your recipe details' : 'Share your delicious creation with the community'}
            </p>
      <div className="mb-8">
            <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
                <FiArrowLeft className="mr-2" />
                Back to Dashboard
            </button>
            
            <div className="flex items-center">
                <TbChefHat className="text-4xl text-orange-500 mr-4" />
                <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    {recipe ? 'Edit Recipe' : 'Create New Recipe'}
                </h1>
                <p className="text-gray-600">
                    {recipe ? 'Update your recipe details' : 'Share your delicious creation with the community'}
                </p>
                </div>
            </div>
            </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiBook className="mr-2 text-orange-500" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Creamy Garlic Pasta"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your recipe in a few sentences..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <FiClock className="mr-2 text-orange-500" />
                    Prep Time (min) *
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="15"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <FiClock className="mr-2 text-orange-500" />
                    Cook Time (min) *
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleChange}
                    placeholder="30"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <FiUsers className="mr-2 text-orange-500" />
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiUpload className="mr-2 text-orange-500" />
              Recipe Image
            </h2>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <FiUpload className="text-4xl text-gray-400 mb-2" />
                <span className="text-gray-600">Click to upload image</span>
                <span className="text-sm text-gray-500 mt-1">Max size: 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FiBook className="mr-2 text-orange-500" />
                Ingredients *
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <FiPlus className="mr-2" />
                Add Ingredient
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-500 font-semibold w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                    placeholder="e.g., 2 cups flour"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'ingredients')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FiBook className="mr-2 text-orange-500" />
                Instructions *
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('instructions')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <FiPlus className="mr-2" />
                Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-500 font-semibold w-8 mt-2">{index + 1}.</span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'instructions')}
                    placeholder="Describe this step..."
                    rows="2"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'instructions')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-2"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Tags (Optional)
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start text-sm text-gray-600">
              <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>Fields marked with * are required</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {recipe ? 'Updating...' : 'Creating...'}
                </>
                ) : (
                <>
                    <FiSave className="mr-2" />
                    {recipe ? 'Update Recipe' : 'Create Recipe'}
                </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeForm;