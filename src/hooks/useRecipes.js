import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};