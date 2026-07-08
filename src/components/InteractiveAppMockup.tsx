/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { User, Bell, PlusCircle, Trash2, Sparkles, Flame, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MockMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function InteractiveAppMockup() {
  // Start with some default logged meals
  const [loggedMeals, setLoggedMeals] = useState<MockMeal[]>([
    { id: "1", name: "Paneer Tikka Bowl", calories: 320, protein: 18, carbs: 14, fats: 22 },
    { id: "2", name: "Sprouted Moong Salad", calories: 210, protein: 14, carbs: 32, fats: 2 },
  ]);

  // Pre-configured meals that users can quickly tap to add
  const quickAddMeals: MockMeal[] = [
    { id: "qa1", name: "Calibrated Butter Chicken", calories: 620, protein: 34, carbs: 48, fats: 26 },
    { id: "qa2", name: "Masala Dosa with Sambar", calories: 410, protein: 9, carbs: 68, fats: 11 },
    { id: "qa3", name: "Calibrated Veg Biryani", calories: 480, protein: 14, carbs: 72, fats: 13 },
  ];

  // Daily target limits
  const calorieTarget = 2000;
  const proteinTarget = 120;
  const carbsTarget = 220;
  const fatsTarget = 65;

  // Calculate current totals
  const totalCalories = loggedMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProtein = loggedMeals.reduce((acc, meal) => acc + meal.protein, 0);
  const totalCarbs = loggedMeals.reduce((acc, meal) => acc + meal.carbs, 0);
  const totalFats = loggedMeals.reduce((acc, meal) => acc + meal.fats, 0);

  const caloriesLeft = Math.max(0, calorieTarget - totalCalories);

  // SVG ring calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, (totalCalories / calorieTarget) * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleAddMeal = (meal: MockMeal) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(), // Generate unique ID
    };
    setLoggedMeals((prev) => [newMeal, ...prev]);
  };

  const handleRemoveMeal = (id: string) => {
    setLoggedMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  return (
    <div className="relative h-[650px] flex items-center justify-center w-full max-w-sm mx-auto">
      {/* Abstract Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-teal-500/15 rounded-full blur-[80px] -z-10 animate-pulse delay-700"></div>

      {/* Main App Mockup with physical dimensions */}
      <div className="relative w-[340px] h-[640px] rounded-[3.2rem] border-[10px] border-slate-900 p-3 bg-slate-950 overflow-hidden shadow-2xl z-10 ring-1 ring-white/10 flex flex-col">
        
        {/* Speaker & Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 rounded-[2.2rem] overflow-y-auto pr-1 select-none flex flex-col gap-4 bg-slate-950 text-white scrollbar-thin scrollbar-thumb-slate-800 pt-6">
          
          {/* Header */}
          <div className="flex justify-between items-center px-4 mt-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="px-4 space-y-0.5">
            <p className="text-xs text-slate-400 font-medium">Good Morning, Rohan</p>
            <p className="text-lg font-bold tracking-tight text-white">Ready for Lunch?</p>
          </div>

          {/* Macro Rings (Highly polished circular visualization) */}
          <div className="mx-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex justify-center items-center gap-6 relative overflow-hidden shadow-md">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r={radius}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="7"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  fill="none"
                  r={radius}
                  stroke="url(#emeraldGradient)"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                {/* Gradient Definition for SVG stroke */}
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold tracking-tight text-white">{caloriesLeft}</span>
                <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase">kcal left</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span className="text-[11px] font-semibold text-slate-200">Protein</span>
                </div>
                <span className="text-xs font-bold text-slate-400 pl-3.5">{totalProtein}g / {proteinTarget}g</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[11px] font-semibold text-slate-200">Carbs</span>
                </div>
                <span className="text-xs font-bold text-slate-400 pl-3.5">{totalCarbs}g / {carbsTarget}g</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  <span className="text-[11px] font-semibold text-slate-200">Fats</span>
                </div>
                <span className="text-xs font-bold text-slate-400 pl-3.5">{totalFats}g / {fatsTarget}g</span>
              </div>
            </div>
          </div>

          {/* Logged Meals List */}
          <div className="px-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Today's Intake</h3>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-none">
              <AnimatePresence initial={false}>
                {loggedMeals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4 text-center text-xs text-slate-500 italic bg-white/[0.01] rounded-xl border border-dashed border-white/5"
                  >
                    No meals logged yet today
                  </motion.div>
                ) : (
                  loggedMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -15 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-100 truncate">{meal.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMeal(meal.id)}
                        className="ml-2 text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 shrink-0"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Add Section */}
          <div className="px-4 space-y-2 mb-4">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Calibrated Presets</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {quickAddMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => handleAddMeal(meal)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 border border-emerald-500/10 text-left transition-all active:scale-[0.98]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-400 truncate">{meal.name}</p>
                    <p className="text-[9px] text-slate-400">
                      +{meal.calories} kcal • Protein: {meal.protein}g
                    </p>
                  </div>
                  <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FLOATING DECORATIONS (Calibrated with Interactivity!) */}
      {/* 1. Left Floater: AI Calibration */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        className="absolute -left-16 top-16 glass-panel p-3 rounded-xl shadow-lg border border-white/10 bg-slate-900/90 flex items-center gap-2.5 select-none cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-teal-400" />
        </div>
        <div className="min-w-[120px]">
          <p className="text-[11px] font-bold text-teal-300">AI Calibration</p>
          <p className="text-[9px] text-slate-400 leading-tight">Adjusting for Basmati Rice...</p>
        </div>
      </motion.div>

      {/* 2. Right Floater: Burned Calories */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        className="absolute -right-12 bottom-28 glass-panel p-3 rounded-xl shadow-lg border border-white/10 bg-slate-900/90 flex items-center gap-2.5 select-none cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Flame className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="min-w-[110px]">
          <p className="text-[11px] font-bold text-emerald-300">240 Calories</p>
          <p className="text-[9px] text-slate-400 leading-tight">Burned in morning walk</p>
        </div>
      </motion.div>
    </div>
  );
}
