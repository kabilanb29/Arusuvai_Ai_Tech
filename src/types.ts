/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NutritionResult {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  gheeOilCalibration: string; // Dynamic tuning for ghee, oil, and tadka
  spiceOptimization: string;  // Insights on digestive spices used
  breakdown: string[];        // Visual itemized breakdown of ingredients
  isMock?: boolean;
  apiError?: boolean;
  quotaExceeded?: boolean;
}

export interface SwapSuggestion {
  swapName: string;
  macroDifference: string;    // e.g. "-120 kcal, +5g Protein"
  reason: string;             // Why this is a healthier alternative
  dynamicGICalibration: string; // Glycemic Index impact
}

export interface SwapResult {
  originalItem: string;
  suggestions: SwapSuggestion[];
  isMock?: boolean;
  apiError?: boolean;
  quotaExceeded?: boolean;
}

export interface IngredientPurpose {
  name: string;
  amount: string;
  purpose: string;            // Why this ingredient is chosen/calibrated
}

export interface RecipeResult {
  recipeName: string;
  prepTime: string;
  cookTime: string;
  ingredients: IngredientPurpose[];
  steps: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthBenefit: string;      // The biological benefit
  isMock?: boolean;
  apiError?: boolean;
  quotaExceeded?: boolean;
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
}

export interface WaitlistUser {
  name: string;
  email: string;
  city: string;
  goal: string;
  pioneerNumber: number;
  registeredAt: string;
}

export interface FeedbackEntry {
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  submittedAt: string;
}


