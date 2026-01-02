import api from './api';

// Get all recipes
export const getRecipes = async (params = {}) => {
  try {
    const response = await api.get('/recipes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Get recent recipes
export const getRecentRecipes = async (params = {}) => {
  return await getRecipes({ ...params, sort: 'newest' });
};

// Get recipes count - SIMPLE & EFFECTIVE
export const getRecipesCount = async () => {
  try {
    // Your API returns pagination with 'total' field
    const response = await api.get('/recipes?limit=1');
    return { count: response.data.total || 0 };
  } catch (error) {
    console.error('Error getting recipe count:', error);
    return { count: 0 };
  }
};

// Get today's recipes count
export const getTodayRecipesCount = async () => {
  try {
    // Get all recipes
    const response = await api.get('/recipes');
    const recipes = response.data.recipes || [];
    
    // Filter by today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecipes = recipes.filter(recipe => {
      if (!recipe.createdAt) return false;
      const recipeDate = new Date(recipe.createdAt);
      recipeDate.setHours(0, 0, 0, 0);
      return recipeDate.getTime() === today.getTime();
    });
    
    return { count: todayRecipes.length };
  } catch (error) {
    console.error('Error getting today recipes count:', error);
    return { count: 0 };
  }
};

// Get recipe statistics
export const getRecipeStats = async () => {
  try {
    const response = await api.get('/recipes');
    const recipes = response.data.recipes || [];
    
    // Calculate stats
    const totalRecipes = recipes.length;
    const totalLikes = recipes.reduce((sum, recipe) => {
      return sum + (recipe.likes?.length || 0);
    }, 0);
    
    const totalRatings = recipes.reduce((sum, recipe) => {
      return sum + (recipe.rating || recipe.averageRating || 0);
    }, 0);
    
    const averageRating = totalRecipes > 0 
      ? totalRatings / totalRecipes 
      : 0;
    
    return {
      totalRecipes,
      totalLikes,
      averageRating: parseFloat(averageRating.toFixed(2))
    };
  } catch (error) {
    console.error('Error getting recipe stats:', error);
    return {
      totalRecipes: 0,
      totalLikes: 0,
      averageRating: 0
    };
  }
};

// Get single recipe
export const getRecipeById = async (id) => {
  try {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
};

// Create recipe
export const createRecipe = async (formData) => {
  try {
    const response = await api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await api.put(`/recipes/${id}`, recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating recipe ${id}:`, error);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
};

// Like recipe
export const likeRecipe = async (id) => {
  try {
    const response = await api.post(`/recipes/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking recipe ${id}:`, error);
    throw error;
  }
};

// Star recipe
export const starRecipe = async (id) => {
  try {
    const response = await api.post(`/recipes/${id}/star`);
    return response.data;
  } catch (error) {
    console.error(`Error starring recipe ${id}:`, error);
    throw error;
  }
};

// Add review
export const addReview = async (id, reviewData) => {
  try {
    const response = await api.post(`/recipes/${id}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error adding review to recipe ${id}:`, error);
    throw error;
  }
};

// Get user's starred recipes
export const getStarredRecipes = async () => {
  try {
    const response = await api.get('/users/starred');
    return response.data;
  } catch (error) {
    console.error('Error fetching starred recipes:', error);
    throw error;
  }
};

// Search recipes
export const searchRecipes = async (query) => {
  try {
    const response = await api.get('/recipes/search', { params: { q: query } });
    return response.data.recipes || [];
  } catch (error) {
    console.error(`Error searching recipes for "${query}":`, error);
    return [];
  }
};

// Get recipes by category
export const getRecipesByCategory = async (category) => {
  try {
    const response = await api.get('/recipes', { params: { category } });
    return response.data.recipes || [];
  } catch (error) {
    console.error(`Error fetching recipes for category "${category}":`, error);
    return [];
  }
};

// Get recipes by user
export const getRecipesByUser = async (userId) => {
  try {
    const response = await api.get('/recipes', { params: { user: userId } });
    return response.data.recipes || [];
  } catch (error) {
    console.error(`Error fetching recipes for user ${userId}:`, error);
    return [];
  }
};