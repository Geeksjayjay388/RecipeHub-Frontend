import api from './api';

// Get all recipes
export const getRecipes = async (params = {}) => {
  try {
    console.log('📡 Calling /api/recipes with params:', params);
    const response = await api.get('/recipes', { params });
    console.log('📦 API Response:', response);
    console.log('📦 Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error in getRecipes:', error);
    console.error('❌ Error response:', error.response);
    throw error;
  }
};

// Get recent recipes (alias for getRecipes with sort param)
export const getRecentRecipes = async (params = {}) => {
  return await getRecipes({ ...params, sort: 'newest' });
};

// Get recipes count
export const getRecipesCount = async () => {
  try {
    const response = await api.get('/recipes/count');
    return response.data;
  } catch (error) {
    // Fallback: get all recipes and count them
    const recipes = await getRecipes();
    return { count: recipes.recipes?.length || recipes.length || 0 };
  }
};

// ✅ Get today's recipes count
export const getTodayRecipesCount = async () => {
  try {
    const response = await api.get('/recipes/today-count');
    return response.data;
  } catch (error) {
    // Fallback: get all recipes and filter by today
    console.warn('Today recipes endpoint not available, using fallback');
    try {
      const recipes = await getRecipes({ limit: 1000 });
      const allRecipes = recipes.recipes || recipes;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayRecipes = allRecipes.filter(recipe => {
        const recipeDate = new Date(recipe.createdAt);
        recipeDate.setHours(0, 0, 0, 0);
        return recipeDate.getTime() === today.getTime();
      });
      
      return { count: todayRecipes.length };
    } catch (fallbackError) {
      return { count: 0 };
    }
  }
};

// ✅ Get recipe statistics
export const getRecipeStats = async () => {
  try {
    const response = await api.get('/recipes/stats');
    return response.data;
  } catch (error) {
    // Fallback: calculate stats from all recipes
    console.warn('Recipe stats endpoint not available, using fallback');
    try {
      const recipes = await getRecipes({ limit: 1000 });
      const allRecipes = recipes.recipes || recipes;
      
      const totalLikes = allRecipes.reduce((sum, recipe) => {
        return sum + (recipe.likes?.length || 0);
      }, 0);
      
      const totalRatings = allRecipes.reduce((sum, recipe) => {
        return sum + (recipe.rating || recipe.averageRating || 0);
      }, 0);
      
      const averageRating = allRecipes.length > 0 
        ? totalRatings / allRecipes.length 
        : 0;
      
      return {
        totalLikes,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRecipes: allRecipes.length
      };
    } catch (fallbackError) {
      return {
        totalLikes: 0,
        averageRating: 0,
        totalRecipes: 0
      };
    }
  }
};

// Get single recipe
export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

// Create recipe (Admin)
export const createRecipe = async (formData) => {
  const response = await api.post('/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update recipe (Admin)
export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/${id}`, recipeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete recipe (Admin)
export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

// Like recipe
export const likeRecipe = async (id) => {
  const response = await api.post(`/recipes/${id}/like`);
  return response.data;
};

// Star recipe
export const starRecipe = async (id) => {
  const response = await api.post(`/recipes/${id}/star`);
  return response.data;
};

// Add review
export const addReview = async (id, reviewData) => {
  const response = await api.post(`/recipes/${id}/reviews`, reviewData);
  return response.data;
};

// Get user's starred recipes
export const getStarredRecipes = async () => {
  const response = await api.get('/users/starred');
  return response.data;
};