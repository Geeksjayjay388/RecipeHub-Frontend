import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, updateRecipe } from '../../services/recipeService';
import toast from 'react-hot-toast';
import { 
  FiUpload, FiX, FiPlus, FiMinus, FiSave, FiArrowLeft,
  FiClock, FiUsers, FiBook, FiAlertCircle, FiCopy
} from 'react-icons/fi';
import { TbChefHat } from 'react-icons/tb';

const CreateRecipeForm = ({ recipe = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(recipe?.image || null);
  const [bulkInput, setBulkInput] = useState({
    ingredients: '',
    instructions: ''
  });
  
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    category: recipe?.category || 'Breakfast',
    difficulty: recipe?.difficulty || 'Medium',
    prepTime: recipe?.prepTime || '',
    cookTime: recipe?.cookTime || '',
    servings: recipe?.servings || '',
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions?.map(i => i.text || i) || [''],
    image: recipe?.image || null,
    tags: recipe?.tags || []
  });

  React.useEffect(() => {
    if (recipe?.image) {
      setImagePreview(recipe.image);
    }
  }, [recipe]);

  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 
    'Vegetarian', 'Vegan', 'Quick'
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
      // Removed file size limit
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      toast.success('Image uploaded successfully!');
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

  // New: Bulk paste handler for ingredients
  const handleBulkPasteIngredients = () => {
    if (!bulkInput.ingredients.trim()) {
      toast.error('Please paste some ingredients first');
      return;
    }
    
    const ingredientsList = bulkInput.ingredients
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (ingredientsList.length === 0) {
      toast.error('No valid ingredients found');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      ingredients: ingredientsList
    }));
    
    setBulkInput(prev => ({ ...prev, ingredients: '' }));
    toast.success(`Added ${ingredientsList.length} ingredients!`);
  };

  // New: Bulk paste handler for instructions
  const handleBulkPasteInstructions = () => {
    if (!bulkInput.instructions.trim()) {
      toast.error('Please paste some instructions first');
      return;
    }
    
    const instructionsList = bulkInput.instructions
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (instructionsList.length === 0) {
      toast.error('No valid instructions found');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      instructions: instructionsList
    }));
    
    setBulkInput(prev => ({ ...prev, instructions: '' }));
    toast.success(`Added ${instructionsList.length} instruction steps!`);
  };

  // New: Copy from clipboard
  const pasteFromClipboard = async (field) => {
    try {
      const text = await navigator.clipboard.readText();
      setBulkInput(prev => ({ ...prev, [field]: text }));
      toast.success('Pasted from clipboard!');
    } catch (err) {
      toast.error('Failed to access clipboard');
    }
  };

  // New: Auto-split helper text
  const bulkInputExamples = {
    ingredients: `Example:\n2 cups flour\n1 tsp salt\n3 eggs\n1 cup milk\n2 tbsp butter`,
    instructions: `Example:\nPreheat oven to 350°F\nMix dry ingredients\nAdd wet ingredients\nBake for 30 minutes\nLet cool before serving`
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

    try {
      setLoading(true);
      
      const recipeData = new FormData();
      
      // Add all fields
      recipeData.append('title', formData.title.trim());
      recipeData.append('description', formData.description.trim());
      recipeData.append('category', formData.category);
      recipeData.append('difficulty', formData.difficulty);
      recipeData.append('prepTime', formData.prepTime.toString());
      recipeData.append('cookTime', formData.cookTime.toString());
      recipeData.append('servings', formData.servings.toString());
      
      // Format arrays correctly
      const cleanIngredients = formData.ingredients.filter(i => i.trim()).map(i => i.trim());
      const cleanInstructions = formData.instructions
        .filter(i => i.trim())
        .map((instruction, index) => ({
          step: index + 1,
          text: instruction.trim()
        }));
      
      // Validate arrays are not empty
      if (cleanIngredients.length === 0) {
        toast.error('Please add at least one ingredient');
        setLoading(false);
        return;
      }
      
      if (cleanInstructions.length === 0) {
        toast.error('Please add at least one instruction');
        setLoading(false);
        return;
      }
      
      recipeData.append('ingredients', JSON.stringify(cleanIngredients));
      recipeData.append('instructions', JSON.stringify(cleanInstructions));
      recipeData.append('tags', JSON.stringify(formData.tags));
      
      // Add image if it's a file
      if (formData.image && typeof formData.image !== 'string') {
        recipeData.append('image', formData.image);
      }

      if (recipe) {
        await updateRecipe(recipe._id, recipeData);
        toast.success('✅ Recipe updated successfully!');
      } else {
        await createRecipe(recipeData);
        toast.success('✅ Recipe created successfully!');
      }
      
      navigate('/admin');
      
    } catch (error) {
      console.error('❌ Error saving recipe:', error);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || `Failed to ${recipe ? 'update' : 'create'} recipe`;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
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

          {/* Image Upload - No size limit */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiUpload className="mr-2 text-orange-500" />
              Recipe Image
            </h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700 text-sm">
                <span className="font-semibold">💡 Tip:</span> Upload high-quality images for better presentation. No size limits!
              </p>
            </div>
            
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
                <span className="text-sm text-gray-500 mt-1">No size limits • JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Ingredients - Bulk Paste Option */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
                <FiBook className="mr-2 text-orange-500" />
                Ingredients *
              </h2>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('bulk-ingredients').focus()}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <FiPaste className="mr-2" />
                  Quick Paste
                </button>
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <FiPlus className="mr-2" />
                  Add One
                </button>
              </div>
            </div>
            
            {/* Bulk Input Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FiPaste className="mr-2 text-green-500" />
                Paste Ingredients (One per line)
              </label>
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => pasteFromClipboard('ingredients')}
                  className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  <FiCopy className="mr-1" />
                  Paste from Clipboard
                </button>
              </div>
              <textarea
                id="bulk-ingredients"
                value={bulkInput.ingredients}
                onChange={(e) => setBulkInput(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder={bulkInputExamples.ingredients}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {bulkInput.ingredients.split('\n').filter(l => l.trim()).length} ingredients detected
                </span>
                <button
                  type="button"
                  onClick={handleBulkPasteIngredients}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  Add All Ingredients
                </button>
              </div>
            </div>
            
            {/* Individual Ingredients List */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">
                Currently have {formData.ingredients.filter(i => i.trim()).length} ingredients:
              </p>
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

          {/* Instructions - Bulk Paste Option */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
                <FiBook className="mr-2 text-orange-500" />
                Instructions *
              </h2>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('bulk-instructions').focus()}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <FiPaste className="mr-2" />
                  Quick Paste
                </button>
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions')}
                  className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <FiPlus className="mr-2" />
                  Add One
                </button>
              </div>
            </div>
            
            {/* Bulk Input Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FiPaste className="mr-2 text-green-500" />
                Paste Instructions (One step per line)
              </label>
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => pasteFromClipboard('instructions')}
                  className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  <FiCopy className="mr-1" />
                  Paste from Clipboard
                </button>
              </div>
              <textarea
                id="bulk-instructions"
                value={bulkInput.instructions}
                onChange={(e) => setBulkInput(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder={bulkInputExamples.instructions}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {bulkInput.instructions.split('\n').filter(l => l.trim()).length} steps detected
                </span>
                <button
                  type="button"
                  onClick={handleBulkPasteInstructions}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  Add All Steps
                </button>
              </div>
            </div>
            
            {/* Individual Instructions List */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">
                Currently have {formData.instructions.filter(i => i.trim()).length} steps:
              </p>
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl shadow-lg p-6 space-y-4 md:space-y-0">
            <div className="flex items-start text-sm text-gray-600">
              <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span>Fields marked with * are required</span>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use the "Quick Paste" feature to save time on ingredients and instructions!
                </p>
              </div>
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