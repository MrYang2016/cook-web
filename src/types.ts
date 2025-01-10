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
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips: string[];
}

export type MenuSuggestions = {
  recommend: string[];
  reason: string;
};
