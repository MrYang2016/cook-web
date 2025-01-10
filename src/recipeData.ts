import { RecipeType, MenuSuggestions } from './types';

export const getRecipeOrSuggestions = async (input: string): Promise<RecipeType | MenuSuggestions> => {
  const response = await fetch(`http://localhost:3004/cook/check-by-input?input=${input}`);
  const data = await response.json();
  return data;
};