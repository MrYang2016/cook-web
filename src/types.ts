export interface RecipeStep {
  title: string;
  description: string;
  reason: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeType {
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips: string[];
  suggestions: string[];
}

export type MenuSuggestions = {
  recommend: string[];
  reason: string;
};
