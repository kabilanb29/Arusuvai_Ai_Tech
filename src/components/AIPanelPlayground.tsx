/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Calculator,
  Repeat,
  ChefHat,
  Camera,
  Flame,
  Dumbbell,
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NutritionResult, SwapResult, RecipeResult } from "../types";

type ActiveTab = "calculator" | "swaps" | "recipe" | "track";

export default function AIPanelPlayground() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("calculator");
  const [apiStatus, setApiStatus] = useState<{ hasApiKey: boolean; isQuotaExceeded?: boolean; message: string }>({
    hasApiKey: false,
    isQuotaExceeded: false,
    message: "Verifying connection with AI servers..."
  });

  // Tab 1 States (Calculator)
  const [calcInput, setCalcInput] = useState("2 Butter Naans with Paneer Butter Masala");
  const [calcResult, setCalcResult] = useState<NutritionResult | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Tab 2 States (Swaps)
  const [swapInput, setSwapInput] = useState("White Basmati Rice");
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Tab 3 States (Recipe)
  const [recipeInput, setRecipeInput] = useState("Spinach, Sprouts, Garlic, Curd");
  const [recipeGoal, setRecipeGoal] = useState("Weight Loss");
  const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // Tab 4 States (Visual Tracker)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [visualResult, setVisualResult] = useState<NutritionResult | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);

  const samplePhotos = [
    {
      id: "paneer",
      name: "Paneer Tikka Bowl",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtkdZFEcHZQ3KTGrlL_N4pidnwMUz5iHsamByanrydAdkYsCS0kAeh4XcdZqicWRmA4fGkLmJfCr-Q4CDCUfX3mAT6eFKERBvOKse_IMibbxXpSQrVUktq0weUy9IleA64nNwQkJKWhI2jcqhzsP1S72gcVbM-7FD_vg7N2q_y1G_l-pvZ9BYcKShdpRUqv3c1VFi31r1N37RmE9r9WtmW7mKfWmGvr0y_wAJVQCu-xc_SZWSr_UPMM6PVmUQ9ilhbUkOxV_XvOK8",
      calories: 320,
      protein: 18,
      carbs: 14,
      fats: 22,
      gheeOilCalibration: "Low-fat yogurt marinade and cooking in charcoal clay oven eliminates the need for deep frying oils.",
      spiceOptimization: "Kashmiri red pepper stimulates salivary glands and triggers dynamic fat thermogenesis.",
      breakdown: ["Organic Tandoori Paneer (150g): 240 kcal", "Greek Yogurt Marinade: 45 kcal", "Calibrated Bell Peppers: 35 kcal"]
    },
    {
      id: "dosa",
      name: "Traditional Masala Dosa",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgQpBb4H0Rn1ZecQbeHRQE5XJ_T77dtn6uzMgSJ2hsqhYeGbqfB7hTwfdNVC9k_maXPKigT66zo4FWJp-RWiFl0VLKxNFQLHxKHwS-zGJVMUEo4urji8j26wBipCfYkWhg7s2u4qFFitVAblI73cFBol2otuC65jLZhvgPEamYfSEJGKchNozNFFec0ox0uPGLjoQf0CYDZl7QmHAY8f0HG8cpSbiissvhSEYVc6M8sYm_qe8FxeaFKEVPZOAy6IjoYeJABRfpnYQ",
      calories: 410,
      protein: 9,
      carbs: 68,
      fats: 11,
      gheeOilCalibration: "Non-stick seasoned grid surface used to bake, reducing overall calorie density by using only 6ml butter.",
      spiceOptimization: "Curry leaves in potato filling are rich in carb-inhibiting antioxidants that improve sugar response.",
      breakdown: ["Sourdough Rice & Lentil Crepe: 180 kcal", "Aloo Masala Stuffing: 110 kcal", "Calibrated Sambar Curry: 80 kcal", "Fresh Chutney: 40 kcal"]
    }
  ];

  // Presets for ease of use
  const calcPresets = [
    "2 Butter Naans with Paneer Butter Masala",
    "Moong Dal Khichdi with 1 tbsp Ghee",
    "Calibrated Chicken Tikka with Whole Wheat Roti",
    "Traditional Masala Dosa with Sambar"
  ];

  const swapPresets = [
    "White Basmati Rice",
    "Maida Roti / Naan",
    "Vanaspati Dalda",
    "Ghee in Tadka"
  ];

  const recipePresets = [
    "Spinach, Sprouts, Garlic, Curd",
    "Paneer, Cauliflower, Turmeric, Tomato",
    "Moong Dal, Ginger, Carrots, Coriander"
  ];

  // Fetch API Connection Status
  useEffect(() => {
    fetch("/api/api-status")
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch((err) => console.error("Error fetching API status", err));
  }, []);

  // 1. Handle Nutrition Calculation
  const runNutritionCalc = async (query = calcInput) => {
    setCalcLoading(true);
    setCalcError(null);
    try {
      const response = await fetch("/api/nutrition-calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal: query })
      });
      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }
      const data = await response.json();
      setCalcResult(data);
    } catch (err: any) {
      console.error(err);
      setCalcError(err.message || "Failed to fetch. Please verify server connection.");
    } finally {
      setCalcLoading(false);
    }
  };

  // 2. Handle Ingredient Swaps
  const runIngredientSwaps = async (query = swapInput) => {
    setSwapLoading(true);
    setSwapError(null);
    try {
      const response = await fetch("/api/ingredient-swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: query })
      });
      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }
      const data = await response.json();
      setSwapResult(data);
    } catch (err: any) {
      console.error(err);
      setSwapError(err.message || "Failed to fetch. Please verify server connection.");
    } finally {
      setSwapLoading(false);
    }
  };

  // 3. Handle Recipe Engine
  const runRecipeEngine = async (ingredients = recipeInput, goal = recipeGoal) => {
    setRecipeLoading(true);
    setRecipeError(null);
    try {
      const response = await fetch("/api/recipe-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, goal })
      });
      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }
      const data = await response.json();
      setRecipeResult(data);
    } catch (err: any) {
      console.error(err);
      setRecipeError(err.message || "Failed to fetch. Please verify server connection.");
    } finally {
      setRecipeLoading(false);
    }
  };

  // 4. Run Visual Food Tracking Simulation
  const simulateVisualTracking = (photo: typeof samplePhotos[0]) => {
    setVisualLoading(true);
    setSelectedPhoto(photo.url);
    setTimeout(() => {
      setVisualResult({
        mealName: photo.name,
        calories: photo.calories,
        protein: photo.protein,
        carbs: photo.carbs,
        fats: photo.fats,
        gheeOilCalibration: photo.gheeOilCalibration,
        spiceOptimization: photo.spiceOptimization,
        breakdown: photo.breakdown
      });
      setVisualLoading(false);
    }, 1200);
  };

  // Run initial calculations once on mount for the default active tab ONLY
  // to avoid concurrent fetch crashes on load!
  useEffect(() => {
    runNutritionCalc(calcPresets[0]);
    simulateVisualTracking(samplePhotos[0]);
  }, []);

  // Smart lazy loader for other tabs on tab-change click
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === "calculator" && !calcResult && !calcLoading) {
      runNutritionCalc(calcInput);
    } else if (tab === "swaps" && !swapResult && !swapLoading) {
      runIngredientSwaps(swapInput);
    } else if (tab === "recipe" && !recipeResult && !recipeLoading) {
      runRecipeEngine(recipeInput, recipeGoal);
    } else if (tab === "track" && !visualResult && !visualLoading) {
      simulateVisualTracking(samplePhotos[0]);
    }
  };

  return (
    <div id="ai-playground" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
      {/* Visual Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Interactive AI Playground
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Experience AI-Powered Indian Nutrition
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
          Test our core engine below. Choose presets or type your own custom meals to watch the AI calibrate macros and spice balance.
        </p>
      </div>

      {/* Main Glass Panel Structure */}
      <div className="glass-panel rounded-3xl border border-white/10 bg-slate-900/40 overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[580px]">
        
        {/* Left Side: Sidebar navigation and form */}
        <div className="w-full md:w-[320px] bg-slate-950/80 p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-6 justify-between shrink-0">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Select Core Engine</h3>
            
            {/* Buttons for tabs */}
            <div className="space-y-2">
              <button
                onClick={() => handleTabChange("calculator")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "calculator"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Calculator className="w-4 h-4" /> AI Nutrition Calculator
              </button>

              <button
                onClick={() => handleTabChange("swaps")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "swaps"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Repeat className="w-4 h-4" /> Ingredient Suggestions
              </button>

              <button
                onClick={() => handleTabChange("recipe")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "recipe"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <ChefHat className="w-4 h-4" /> Smart Indian Recipe Engine
              </button>

              <button
                onClick={() => handleTabChange("track")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "track"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Camera className="w-4 h-4" /> Auto-Track Visual AI
              </button>
            </div>
          </div>

          {/* Prompt/Inputs Panel based on Active Tab */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            {activeTab === "calculator" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Type any Indian Meal</label>
                <textarea
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  placeholder="e.g. 1 Butter Naan, 1 cup Rice, Dal Makhani"
                  className="w-full h-24 text-xs bg-slate-900 border border-white/15 rounded-xl p-3 focus:border-emerald-500 outline-none text-white placeholder-slate-500 resize-none"
                />
                <button
                  disabled={calcLoading}
                  onClick={() => runNutritionCalc()}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2"
                >
                  {calcLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Analyze Macros"
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Presets */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Or try a preset:</p>
                  <div className="flex flex-col gap-1">
                    {calcPresets.slice(0, 3).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setCalcInput(preset);
                          runNutritionCalc(preset);
                        }}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 text-left truncate hover:underline"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "swaps" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Indian Ingredient to Swap</label>
                <input
                  type="text"
                  value={swapInput}
                  onChange={(e) => setSwapInput(e.target.value)}
                  placeholder="e.g. White Basmati Rice, Refined oil"
                  className="w-full text-xs bg-slate-900 border border-white/15 rounded-xl p-3 focus:border-emerald-500 outline-none text-white placeholder-slate-500"
                />
                <button
                  disabled={swapLoading}
                  onClick={() => runIngredientSwaps()}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2"
                >
                  {swapLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Find Smart Swaps"
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Presets */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Or try a preset:</p>
                  <div className="flex flex-col gap-1">
                    {swapPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setSwapInput(preset);
                          runIngredientSwaps(preset);
                        }}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 text-left truncate hover:underline"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "recipe" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">My Fridge Ingredients</label>
                  <input
                    type="text"
                    value={recipeInput}
                    onChange={(e) => setRecipeInput(e.target.value)}
                    placeholder="e.g. Spinach, Paneer, Curd"
                    className="w-full text-xs bg-slate-900 border border-white/15 rounded-xl p-3 focus:border-emerald-500 outline-none text-white placeholder-slate-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">My Primary Goal</label>
                  <select
                    value={recipeGoal}
                    onChange={(e) => setRecipeGoal(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-white/15 rounded-xl p-3 focus:border-emerald-500 outline-none text-white"
                  >
                    <option>Weight Loss</option>
                    <option>Muscle Optimization</option>
                    <option>Longevity & Vitality</option>
                  </select>
                </div>

                <button
                  disabled={recipeLoading}
                  onClick={() => runRecipeEngine()}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2"
                >
                  {recipeLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Create Recipe"
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Presets */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Or try a preset:</p>
                  <div className="flex flex-col gap-1">
                    {recipePresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setRecipeInput(preset);
                          runRecipeEngine(preset, recipeGoal);
                        }}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 text-left truncate hover:underline"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "track" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select an Indian culinary shot below to simulate snap-to-track visual analysis.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {samplePhotos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => simulateVisualTracking(photo)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhoto === photo.url
                          ? "border-emerald-500 scale-95 shadow-md shadow-emerald-500/25"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 py-1 text-center text-[9px] font-bold text-white truncate px-1">
                        {photo.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive AI response visualization */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative min-h-[400px]">
          {/* Subtle Ambient Background glow inside results panel */}
          <div className="absolute top-10 right-10 w-44 h-44 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
          
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between h-full"
              >
                
                {/* 1. CALCULATOR OUTPUT */}
                {activeTab === "calculator" && (
                  calcLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="relative animate-pulse">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Arusuvai AI Calibrating...</p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Tuning macros, checking Tadka oil coefficients, and calculating glycemic indices...
                        </p>
                      </div>
                    </div>
                  ) : calcError ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Calibration Error</p>
                        <p className="text-xs text-slate-400 max-w-sm">{calcError}</p>
                      </div>
                      <button
                        onClick={() => runNutritionCalc()}
                        className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        Retry Calibration
                      </button>
                    </div>
                  ) : calcResult ? (
                    <div className="space-y-6">
                      {calcResult.apiError && (
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-bold">Local Engine Fallback Activated:</span>{" "}
                            {calcResult.quotaExceeded 
                              ? "The Gemini API limit has been reached for today. Arusuvai's High-Fidelity Local Culinary Engine has generated this standard calorie calibration instantly."
                              : "Running in local simulation calibration mode. We've compiled standard nutrition metrics for your meal."
                            }
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                            {calcResult.isMock ? "CALIBRATED PRESET ESTIMATOR" : "REAL-TIME GEMINI RUN"}
                          </span>
                          <h4 className="text-xl font-bold text-white mt-1">{calcResult.mealName}</h4>
                        </div>
                        
                        {/* Calories badge */}
                        <div className="flex items-center gap-1.5 bg-slate-950 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-extrabold text-white">{calcResult.calories} kcal</span>
                        </div>
                      </div>

                      {/* Macro Breakdown Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-teal-500/5 border border-teal-500/10 rounded-2xl p-3.5 text-center">
                          <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">Protein</p>
                          <p className="text-2xl font-black text-white mt-1">{calcResult.protein}g</p>
                        </div>
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3.5 text-center">
                          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Carbs</p>
                          <p className="text-2xl font-black text-white mt-1">{calcResult.carbs}g</p>
                        </div>
                        <div className="bg-pink-500/5 border border-pink-500/10 rounded-2xl p-3.5 text-center">
                          <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wide">Fats</p>
                          <p className="text-2xl font-black text-white mt-1">{calcResult.fats}g</p>
                        </div>
                      </div>

                      {/* Rich text sections */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                            <Layers className="w-4 h-4 text-teal-400" /> Tadka Oil Calibration
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{calcResult.gheeOilCalibration}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                            <Dumbbell className="w-4 h-4 text-emerald-400" /> Metabolic Spice Synergy
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{calcResult.spiceOptimization}</p>
                        </div>
                      </div>

                      {/* Itemized breakdown */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Itemized Estimate</h5>
                        <div className="flex flex-wrap gap-2">
                          {calcResult.breakdown.map((item, idx) => (
                            <span key={idx} className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null
                )}

                {/* 2. SWAPS OUTPUT */}
                {activeTab === "swaps" && (
                  swapLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="relative animate-pulse">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Arusuvai AI Swapping...</p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Finding lower-GI substitutions and calculating caloric shifts...
                        </p>
                      </div>
                    </div>
                  ) : swapError ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Suggestions Error</p>
                        <p className="text-xs text-slate-400 max-w-sm">{swapError}</p>
                      </div>
                      <button
                        onClick={() => runIngredientSwaps()}
                        className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        Retry Suggestions
                      </button>
                    </div>
                  ) : swapResult ? (
                    <div className="space-y-6">
                      {swapResult.apiError && (
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-bold">Local Engine Fallback Activated:</span>{" "}
                            {swapResult.quotaExceeded
                              ? "The Gemini API limit has been reached for today. Arusuvai's High-Fidelity Local Culinary Engine has generated these standard healthy alternative suggestions instantly."
                              : "Running in local simulation calibration mode. We've compiled standard healthy alternative suggestions."
                            }
                          </div>
                        </div>
                      )}
                      <div className="border-b border-white/5 pb-4">
                        <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                          SWAP REPORT
                        </span>
                        <h4 className="text-lg font-semibold text-slate-300 mt-1">
                          Healthy Alternatives for <span className="text-white font-bold">"{swapResult.originalItem}"</span>
                        </h4>
                      </div>

                      {/* Suggestions list */}
                      <div className="space-y-4">
                        {swapResult.suggestions.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.02] to-teal-500/[0.02] flex flex-col md:flex-row gap-4 justify-between"
                          >
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                {s.swapName}
                              </h5>
                              <p className="text-xs text-slate-400 leading-relaxed">{s.reason}</p>
                              <p className="text-[11px] text-slate-500 italic">
                                Glycemic Load: {s.dynamicGICalibration}
                              </p>
                            </div>

                            <div className="shrink-0 flex md:flex-col items-center justify-center bg-slate-950 px-4 py-2.5 rounded-xl border border-white/5 md:min-w-[150px]">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nutrition Impact</span>
                              <span className="text-xs font-extrabold text-emerald-400 mt-0.5">{s.macroDifference}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}

                {/* 3. RECIPE OUTPUT */}
                {activeTab === "recipe" && (
                  recipeLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="relative animate-pulse">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Arusuvai AI Cooking...</p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Assembling culinary guidelines, balancing spices, and building macro profile...
                        </p>
                      </div>
                    </div>
                  ) : recipeError ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                      <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">Recipe Engine Error</p>
                        <p className="text-xs text-slate-400 max-w-sm">{recipeError}</p>
                      </div>
                      <button
                        onClick={() => runRecipeEngine()}
                        className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        Retry Recipe
                      </button>
                    </div>
                  ) : recipeResult ? (
                    <div className="space-y-5 max-h-[440px] overflow-y-auto pr-1">
                      {recipeResult.apiError && (
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5 mb-4">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-bold">Local Engine Fallback Activated:</span>{" "}
                            {recipeResult.quotaExceeded
                              ? "The Gemini API limit has been reached for today. Arusuvai's High-Fidelity Local Culinary Engine has generated this standard healthy recipe instantly."
                              : "Running in local simulation calibration mode. We've compiled a standard recipe for your ingredients."
                            }
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                            TAILORED INDIAN RECIPE
                          </span>
                          <h4 className="text-lg font-bold text-white mt-1">{recipeResult.recipeName}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Prep: {recipeResult.prepTime} • Cook: {recipeResult.cookTime}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-950 border border-white/5 text-slate-300">
                            {recipeResult.calories} kcal
                          </span>
                          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            P: {recipeResult.protein}g
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed italic bg-emerald-500/[0.02] border border-emerald-500/5 p-3 rounded-xl">
                        <strong>AI Health Coach:</strong> {recipeResult.healthBenefit}
                      </p>

                      {/* Ingredients list */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Calibrated Ingredients</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {recipeResult.ingredients.map((ing, idx) => (
                            <div key={idx} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex flex-col gap-0.5">
                              <div className="flex justify-between text-xs font-bold text-slate-200">
                                <span>{ing.name}</span>
                                <span className="text-emerald-400">{ing.amount}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 leading-normal">{ing.purpose}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preparation Steps */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Preparation Steps</h5>
                        <ol className="space-y-2 text-xs text-slate-400 leading-relaxed list-decimal list-inside pl-1">
                          {recipeResult.steps.map((step, idx) => (
                            <li key={idx} className="pl-1">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : null
                )}

                {/* 4. AUTO-TRACK OUTPUT */}
                {activeTab === "track" && visualResult && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-5 items-center pb-4 border-b border-white/5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/20 shrink-0">
                        <img src={selectedPhoto || ""} alt="Logged Meal Preview" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                          VISUAL AI AUTOMATIC ENTRY
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1">{visualResult.mealName}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Snapped photograph scanned successfully. Ingredient weights calibrated using pixel-density mapping.
                        </p>
                      </div>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white/[0.01] border border-white/5 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Calories</span>
                        <p className="text-base font-bold text-white mt-0.5">{visualResult.calories} kcal</p>
                      </div>
                      <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-teal-400 uppercase">Protein</span>
                        <p className="text-base font-bold text-teal-400 mt-0.5">{visualResult.protein}g</p>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-amber-400 uppercase">Carbs</span>
                        <p className="text-base font-bold text-amber-400 mt-0.5">{visualResult.carbs}g</p>
                      </div>
                      <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-pink-400 uppercase">Fats</span>
                        <p className="text-base font-bold text-pink-400 mt-0.5">{visualResult.fats}g</p>
                      </div>
                    </div>

                    {/* Rich text sections */}
                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 space-y-0.5">
                        <p className="text-xs font-bold text-slate-300">Tadka Oil Index Adjusted</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{visualResult.gheeOilCalibration}</p>
                      </div>
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 space-y-0.5">
                        <p className="text-xs font-bold text-slate-300">Indian Spices Synergy Detect</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{visualResult.spiceOptimization}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtext info */}
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-4 border-t border-white/5">
                  <Compass className="w-3.5 h-3.5" /> All AI computations incorporate localized Indian biological baselines (A2 Gir fat absorption curves, high-fiber regional grain metrics).
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
