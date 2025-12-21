import React, { createContext, useState, useContext } from 'react';
import { getRecipes, likeRecipe, starRecipe } from '../services/recipeService';
import toast from 'react-hot-toast'; // Import toast here

const RecipeContext = createContext();

export const useRecipe = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching recipes from:', 'http://localhost:5500/api/recipes');
      const data = await getRecipes(params);
      console.log('✅ Recipes fetched:', data);
      setRecipes(data.recipes || data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching recipes:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch recipes';
      setError(errorMsg);
      toast.error(errorMsg); // Show toast error here
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    try {
      const result = await likeRecipe(recipeId);
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, likes: result.likes, liked: result.liked }
            : recipe
        )
      );
      toast.success(result.liked ? 'Recipe liked!' : 'Recipe unliked');
      return result;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to like recipe';
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleStar = async (recipeId) => {
    try {
      const result = await starRecipe(recipeId);
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId
            ? { ...recipe, stars: result.stars, starred: result.starred }
            : recipe
        )
      );
      toast.success(result.starred ? 'Recipe saved to favorites!' : 'Recipe removed from favorites');
      return result;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save recipe';
      toast.error(errorMsg);
      throw error;
    }
  };

  const addRecipe = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const updateRecipe = (updatedRecipe) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  const deleteRecipe = (recipeId) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      loading,
      error,
      fetchRecipes,
      handleLike,
      handleStar,
      addRecipe,
      updateRecipe,
      deleteRecipe
    }}>
      {children}
    </RecipeContext.Provider>
  );
};