/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingDown,
  Flame,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Compass,
  BookOpen,
  CheckCircle,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import InteractiveAppMockup from "./components/InteractiveAppMockup";
import AIPanelPlayground from "./components/AIPanelPlayground";
import EarlyAccessForm from "./components/EarlyAccessForm";
import Footer from "./components/Footer";
import AdminConsole from "./components/AdminConsole";
import FeedbackForm from "./components/FeedbackForm";

// Audience profiles data
const audienceProfiles = [
  {
    id: "student",
    title: "College Student",
    quote: "Eating healthy shouldn't empty your pocket or keep you in the kitchen for hours.",
    challenge: "Struggling to balance long lecture hours, exams, and limited hostel cooking tools while staying on a budget.",
    solution: "Quick, single-appliance recipes using basic pantry staples (sprouts, oats, eggs) calibrated for low-cost student diets.",
    demoMeal: "High-Protein Sprouts Chaat & Spiced Dahi",
    stats: { time: "5 Mins", cost: "₹35", macros: "P: 14g • C: 22g" }
  },
  {
    id: "professional",
    title: "Busy Professional",
    quote: "No time to cook? Stop relying on high-sodium restaurant food.",
    challenge: "Sitting at a desk for 9 hours, ordering mid-day office snacks, and experiencing post-lunch energy crashes.",
    solution: "15-minute one-pot meals (like loaded dal khichdi) and healthy lunchbox preps that avoid refined oils and prevent sleepiness.",
    demoMeal: "One-Pot Calibrated Moong Dal Khichdi",
    stats: { time: "15 Mins", cost: "₹55", macros: "P: 12g • C: 45g" }
  },
  {
    id: "beginner",
    title: "Fitness Beginner",
    quote: "Ditch complex, frustrating macro math and Western meal plans.",
    challenge: "Confused by food weighing, generic calorie apps, and trying to reach daily protein goals without expensive supplements.",
    solution: "Simple calibrations of everyday Indian food (Roti, Sabji, Paneer) automatically adjusted for fats and proteins.",
    demoMeal: "Paneer Bhurji with 2 Whole Wheat Rotis",
    stats: { time: "12 Mins", cost: "₹75", macros: "P: 24g • C: 36g" }
  },
  {
    id: "lifestyle",
    title: "Healthy Lifer",
    quote: "Build consistent habits and regulate your family's glucose spikes.",
    challenge: "Trying to manage general blood sugar levels, heart health, and cholesterol with home-cooked Indian meals.",
    solution: "Substituting highly refined grains with low-glycemic millets and configuring protective metabolic spices.",
    demoMeal: "Ragi Oats Chilla & Mint Coriander Raita",
    stats: { time: "10 Mins", cost: "₹40", macros: "P: 10g • C: 28g" }
  }
];

// Decision Simulator Recipes
const SIMULATOR_RECIPES: Record<string, { name: string; calories: number; protein: number; carbs: number; fats: number; desc: string }> = {
  "paneer+spinach+tomatoes": {
    name: "Calibrated Palak Paneer Stir-Fry",
    calories: 260,
    protein: 16,
    carbs: 10,
    fats: 18,
    desc: "A nutrient-rich combination of raw spinach and light paneer cubes sautéed in low ghee. Keeps GI low (under 30) and contains iron and calcium."
  },
  "garlic+moong dal+oats": {
    name: "Savory Oats & Lentil Porridge",
    calories: 230,
    protein: 11,
    carbs: 38,
    fats: 3,
    desc: "A fiber-dense comfort food that aids digestion. Cumin and garlic act as carminatives, preventing gut bloating."
  },
  "curd+garlic+spinach": {
    name: "Spiced Spinach Raita & Roasted Seeds",
    calories: 110,
    protein: 7,
    carbs: 9,
    fats: 4,
    desc: "Probiotic-rich curd combined with folate-packed spinach and digestive garlic. Perfect low-calorie coolant."
  },
  "garlic+moong dal+tomatoes": {
    name: "High-Fiber Dal Shorba",
    calories: 170,
    protein: 9,
    carbs: 24,
    fats: 3,
    desc: "A light, aromatic split yellow mung soup cooked oil-free. Highly restorative and easy on the liver."
  },
  "oats+paneer+tomatoes": {
    name: "Savory Paneer Oats Chilla",
    calories: 290,
    protein: 18,
    carbs: 28,
    fats: 11,
    desc: "Beta-glucan fiber in oats paired with structural proteins in paneer makes this the ultimate fat-loss breakfast."
  }
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // State: Audience Profile Switcher
  const [activeAudience, setActiveAudience] = useState("student");

  // State: "What You Can Do" Interactive items
  // 1. Discover recipes
  const [recipeSearchIng, setRecipeSearchIng] = useState("Moong Dal, Tomato, Spinach");
  const [discoveredRecipe, setDiscoveredRecipe] = useState<{ name: string; cal: number } | null>({
    name: "Calibrated Moong Dal Spinach Soup",
    cal: 190
  });
  
  // 2. Cooking Guidance Steps
  const [activeStep, setActiveStep] = useState(0);
  const guidanceSteps = [
    { title: "Prep & Rinse", desc: "Rinse 50g moong dal and chop 1 cup spinach leaves." },
    { title: "Metabolic Tempering", desc: "Sauté 1/2 tsp cumin seeds & grated ginger in 1/2 tsp Ghee." },
    { title: "Simmer Dal", desc: "Add dal, tomatoes, and 2 cups water. Pressure cook for 3 whistles." },
    { title: "Fold Spinach & Serve", desc: "Stir in spinach, simmer for 2 mins, garnish with coriander." }
  ];

  // 3. Goal Recommendations
  const [recGoal, setRecGoal] = useState("loss");
  const recommendations: Record<string, { dish: string; cal: number; protein: number; why: string }> = {
    loss: { dish: "Foxtail Millet & Veggie Khichdi", cal: 290, protein: 11, why: "High fiber delays digestion, keeping insulin spikes locked low." },
    muscle: { dish: "Baked Tandoori Paneer Salad", cal: 380, protein: 24, why: "Optimized milk protein matrices to maximize post-workout recovery." },
    health: { dish: "Sorghum (Jowar) Roti & Green Sabji", cal: 320, protein: 13, why: "Complex carbs regulate long-term cardiovascular health." }
  };

  // 4. Tadka Oil Calibration (Existing Bento 1)
  const [tadkaOil, setTadkaOil] = useState(30);

  // 5. Glycemic Index (Existing Bento 2)
  const [selectedGrain, setSelectedGrain] = useState<"white-rice" | "millets">("white-rice");

  // 6. Spice Optimizer (Existing Bento 3)
  const [activeSpice, setActiveSpice] = useState<string>("turmeric");
  const spices = [
    {
      id: "turmeric",
      name: "Haldi (Turmeric)",
      benefit: "Anti-Inflammatory Catalyst",
      desc: "Curcumin paired with black pepper enhances bio-absorption by 2000%, balancing cell insulin sensitivity."
    },
    {
      id: "ginger",
      name: "Adrak (Ginger)",
      benefit: "Thermogenic Accelerator",
      desc: "Gingerols stimulate pancreatic enzymes and accelerate calorie expenditure via thermogenesis."
    },
    {
      id: "cumin",
      name: "Jeera (Cumin)",
      benefit: "Bile Secretion Booster",
      desc: "Stimulates liver bile synthesis, enabling rapid breakdown of dense fats and carbohydrates."
    }
  ];

  // State: Everyday Decision Simulator
  const [selectedSimulatorIngs, setSelectedSimulatorIngs] = useState<string[]>(["spinach", "paneer"]);
  const [simulatedRecipeOutput, setSimulatedRecipeOutput] = useState<any>({
    name: "Calibrated Palak Paneer Stir-Fry",
    calories: 260,
    protein: 16,
    carbs: 10,
    fats: 18,
    desc: "A nutrient-rich combination of raw spinach and light paneer cubes sautéed in low ghee. Keeps GI low (under 30) and contains iron and calcium."
  });

  const toggleSimulatorIngredient = (ing: string) => {
    let updated = [...selectedSimulatorIngs];
    if (updated.includes(ing)) {
      if (updated.length > 1) {
        updated = updated.filter((item) => item !== ing);
      }
    } else {
      if (updated.length < 3) {
        updated.push(ing);
      } else {
        // Replace first item to cap at 3
        updated.shift();
        updated.push(ing);
      }
    }
    setSelectedSimulatorIngs(updated);

    // Calculate dynamic recipe based on selected ingredients
    const sortedKey = [...updated].sort().join("+");
    const matched = SIMULATOR_RECIPES[sortedKey];
    if (matched) {
      setSimulatedRecipeOutput(matched);
    } else {
      // General match
      setSimulatedRecipeOutput({
        name: `Arusuvai Calibrated ${updated.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" & ")}`,
        calories: 210,
        protein: 10,
        carbs: 22,
        fats: 8,
        desc: "A custom macro-calibrated recipe rich in micronutrients and healthy dietary fibers tailored to your selected ingredients."
      });
    }
  };

  const handleDiscoverRecipe = () => {
    if (!recipeSearchIng.trim()) return;
    setDiscoveredRecipe({
      name: `Calibrated ${recipeSearchIng.split(",")[0] || "Custom"} Infused Tadka Bowl`,
      cal: 230 + Math.floor(Math.random() * 80)
    });
  };

  if (currentPath === "/admin") {
    return <AdminConsole onClose={() => navigateTo("/")} />;
  }

  const currentAudience = audienceProfiles.find(p => p.id === activeAudience) || audienceProfiles[0];

  return (
    <div className="min-h-screen bg-[#070b15] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Arusuvai AI Tech - Indian Culinary Science
            </div>

            {/* Display Typography Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Your Personal AI <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Nutrition Companion
              </span> <br />
              for Everyday India
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Eating healthy shouldn't be confusing, expensive, or time-consuming. Arusuvai AI Tech helps you make better food choices using the ingredients you already have at home.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleScrollTo("early-access")}
                className="btn-primary px-8 py-4 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform cursor-pointer"
              >
                Request Priority Pass
              </button>
              
              <button
                onClick={() => handleScrollTo("ai-playground")}
                className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Launch AI Lab <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Indian Recipes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">Zero</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Complex Math</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">1,240+</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pioneers Joined</p>
              </div>
            </div>

          </div>

          {/* Right Column: High Fidelity Mobile App Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractiveAppMockup />
          </div>

        </div>
      </header>

      {/* --- AUDIENCE PROFILES SWITCHER --- */}
      <section className="py-16 border-t border-white/5 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
              DESIGNED FOR YOU
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Who We Guide
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Whether you are a student, a busy worker, or trying to manage family blood sugar, our AI adapts to your life.
            </p>
          </div>

          {/* Profile Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {audienceProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveAudience(p.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAudience === p.id
                    ? "bg-emerald-500/15 border border-emerald-500/35 text-emerald-300"
                    : "bg-slate-900/40 text-slate-400 border border-transparent hover:text-slate-200"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Profile Card Output */}
          <div className="max-w-3xl mx-auto glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/30 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">{currentAudience.title}</h3>
              <p className="text-sm italic text-emerald-400 font-medium">
                "{currentAudience.quote}"
              </p>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p><strong>The Challenge:</strong> {currentAudience.challenge}</p>
                <p><strong>How Arusuvai Helps:</strong> {currentAudience.solution}</p>
              </div>
            </div>

            {/* Visual Mini Pass / Summary */}
            <div className="w-full md:w-[260px] bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-3 shrink-0">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">AI Target Suggestion</span>
              <p className="text-xs font-bold text-slate-200">{currentAudience.demoMeal}</p>
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
                <div className="bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Time</span>
                  <p className="text-[11px] font-bold text-emerald-400">{currentAudience.stats.time}</p>
                </div>
                <div className="bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Cost</span>
                  <p className="text-[11px] font-bold text-emerald-400">{currentAudience.stats.cost}</p>
                </div>
                <div className="bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Macros</span>
                  <p className="text-[11px] font-bold text-emerald-400 whitespace-nowrap">{currentAudience.stats.macros.split(" • ")[0]}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleScrollTo("early-access")}
                className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 text-[10px] font-bold text-emerald-300 text-center block cursor-pointer"
              >
                Log Meal in Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHAT YOU CAN DO SECTION (Interactive Capabilities Grid) --- */}
      <section id="features-grid" className="py-24 bg-slate-950/40 border-y border-white/5 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
              INTERACTIVE CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              What You Can Do with Arusuvai AI
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              We bring recipe curation, calorie adjustments, and metabolic science together into one single companion app.
            </p>
          </div>

          {/* Interactive capabilities grid (6 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Discover healthy recipes */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">1. Kitchen Recipe Discovery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover healthy recipes from the ingredients available in your kitchen. Type ingredients below to simulate the AI.
                </p>
              </div>

              <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={recipeSearchIng}
                    onChange={(e) => setRecipeSearchIng(e.target.value)}
                    placeholder="Enter ingredients..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] outline-none text-white focus:border-emerald-500"
                  />
                  <button
                    onClick={handleDiscoverRecipe}
                    className="px-2.5 py-2 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-bold hover:bg-emerald-400 cursor-pointer"
                  >
                    Find
                  </button>
                </div>
                {discoveredRecipe && (
                  <div className="text-[10px] p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-slate-300 flex justify-between items-center animate-fadeIn">
                    <span className="truncate max-w-[130px] font-semibold">{discoveredRecipe.name}</span>
                    <span className="text-emerald-400 font-bold shrink-0">{discoveredRecipe.cal} kcal</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Step-by-step guidance */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">2. Cooking Guidance</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get easy, step-by-step cooking guidance. Tap through steps to see how the AI schedules cooking.
                </p>
              </div>

              <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                  <span>STEP {activeStep + 1} OF 4</span>
                  <span className="text-teal-400 uppercase font-extrabold">{guidanceSteps[activeStep].title}</span>
                </div>
                <p className="text-[10px] text-slate-300 min-h-[32px] leading-normal">{guidanceSteps[activeStep].desc}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="flex-1 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    disabled={activeStep === 3}
                    onClick={() => setActiveStep(prev => prev + 1)}
                    className="flex-1 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-[9px] font-bold text-teal-400 hover:bg-teal-500/20 disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Goal-based meal recommendations */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">3. Meal Recommendations</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive personalized meal recommendations based on your health goals. Switch goals below:
                </p>
              </div>

              <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex gap-1">
                  {["loss", "muscle", "health"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setRecGoal(g)}
                      className={`flex-1 py-1 text-[9px] font-bold uppercase rounded cursor-pointer ${
                        recGoal === g ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-slate-900 text-slate-500"
                      }`}
                    >
                      {g === "loss" ? "Weight" : g === "muscle" ? "Muscle" : "Vitality"}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] pt-1">
                  <p className="font-bold text-slate-200">{recommendations[recGoal].dish}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{recommendations[recGoal].why}</p>
                  <span className="text-[9px] text-rose-400 font-bold uppercase mt-1 block">Calibrated: {recommendations[recGoal].cal} kcal</span>
                </div>
              </div>
            </div>

            {/* 4. Understand nutrition (Slider) */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">4. Understand Tadka & Fats</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Understand the true nutritional impact of oil. Slider calibrates Ghee/Tadka volume in subjis.
                </p>
              </div>

              <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-slate-500 font-bold uppercase">Tadka Coefficient</span>
                  <span className="font-bold text-amber-400">+{Math.round(tadkaOil * 2.8)} kcal added</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tadkaOil}
                  onChange={(e) => setTadkaOil(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded accent-emerald-500 cursor-pointer"
                />
                <p className="text-[9px] text-slate-400 italic leading-tight">
                  {tadkaOil < 25 ? "Steamed prep - Minimal lipid response." : tadkaOil < 65 ? "Home style - Slower fat-burning." : "Heavy Tadka - High saturation load."}
                </p>
              </div>
            </div>

            {/* 5. Track effortlessly (Visual Simulator) */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">5. Track Food Effortlessly</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Skip manual entries. Pixels are scanned and mapped to regional Indian recipes in our AI Lab.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Test Visual Tracker</span>
                <button
                  onClick={() => handleScrollTo("ai-playground")}
                  className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  Open AI Lab <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 6. Build habits without guesswork (GI graph) */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-slate-900/40 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingDown className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">6. Build Habits Without Guesswork</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Establish stable insulin loops. Tap below to see grain replacement Glycemic impact.
                </p>
              </div>

              <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGrain("white-rice")}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      selectedGrain === "white-rice" ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-slate-900 text-slate-500"
                    }`}
                  >
                    Rice (GI: 72)
                  </button>
                  <button
                    onClick={() => setSelectedGrain("millets")}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      selectedGrain === "millets" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-500"
                    }`}
                  >
                    Millet (GI: 51)
                  </button>
                </div>
                
                {/* SVG Curve */}
                <div className="h-10 relative flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <AnimatePresence mode="wait">
                      {selectedGrain === "white-rice" ? (
                        <motion.path
                          key="white-rice-curve"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          exit={{ opacity: 0 }}
                          d="M 5,35 Q 25,-10 50,30 T 95,35"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2"
                        />
                      ) : (
                        <motion.path
                          key="millet-curve"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          exit={{ opacity: 0 }}
                          d="M 5,35 Q 30,18 50,22 T 95,35"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                      )}
                    </AnimatePresence>
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-[#070b15] to-slate-950 relative overflow-hidden">
        {/* Abstract vector */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.04] rounded-bl-full"></div>
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full block w-max">
                OUR MISSION
              </span>
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                Making Healthy Eating Accessible
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                To make healthy eating simple, personalized, and accessible for every Indian through the power of AI.
              </p>
            </div>
            <p className="text-xs text-slate-500 border-t border-white/5 pt-4">
              Calibrating regional food profiles without shifting to expensive, imported diet regimes.
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-teal-500/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/[0.04] rounded-bl-full"></div>
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-teal-400 uppercase bg-teal-500/10 px-3 py-1 rounded-full block w-max">
                OUR VISION
              </span>
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                India's Most Trusted Nutrition App
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                To become India's most trusted AI-powered nutrition platform, helping millions of people make smarter food choices and live healthier lives—one meal at a time.
              </p>
            </div>
            <p className="text-xs text-slate-500 border-t border-white/5 pt-4">
              Creating a scalable ecosystem that turns every home kitchen into a hub of healthy longevity.
            </p>
          </div>

        </div>
      </section>

      {/* --- WHY ARUSUVAI AI TECH? (Everyday Decision Simulator) --- */}
      <section className="py-20 border-t border-white/5 bg-slate-950/20 relative">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
                WHY ARUSUVAI AI TECH?
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Healthy Eating Starts With <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Everyday Decisions</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Because healthy eating starts with everyday decisions. We help you make those decisions easier by turning the ingredients in your kitchen into nutritious meals while keeping your health goals on track.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No need to purchase expensive, exotic imports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Maps ingredients you already have at home</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive calculations for spice synergy and cooking volumes</span>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Everyday Decisions Simulator */}
            <div className="lg:col-span-6">
              <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/50 space-y-6 relative">
                <div>
                  <h3 className="text-lg font-bold text-white">Everyday Decision Simulator</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Select up to 3 ingredients found in your fridge. Watch our simulated AI curate a healthy meal.
                  </p>
                </div>

                {/* Fridge selections */}
                <div className="flex flex-wrap gap-1.5">
                  {["spinach", "paneer", "tomatoes", "moong dal", "oats", "curd", "garlic"].map((ing) => {
                    const isSelected = selectedSimulatorIngs.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleSimulatorIngredient(ing)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                            : "bg-slate-950 text-slate-400 border border-white/5 hover:text-white"
                        }`}
                      >
                        {ing}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Output pass */}
                <div className="bg-slate-950 p-4.5 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/[0.02] rounded-bl-full"></div>
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest block">AI Calibrated Output</span>
                  <p className="text-xs font-bold text-white">{simulatedRecipeOutput.name}</p>
                  <p className="text-[10px] text-slate-400 leading-normal">{simulatedRecipeOutput.desc}</p>
                  
                  {/* Macros breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center text-[10px] font-semibold text-slate-300">
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase block font-bold">Calories</span>
                      <span className="text-emerald-400 font-bold">{simulatedRecipeOutput.calories} kcal</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase block font-bold">Protein</span>
                      <span>{simulatedRecipeOutput.protein}g</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase block font-bold">Carbs</span>
                      <span>{simulatedRecipeOutput.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase block font-bold">Fats</span>
                      <span>{simulatedRecipeOutput.fats}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- AI NUTRITION LAB PLAYGROUND --- */}
      <section className="bg-slate-900/10 border-b border-white/5">
        <AIPanelPlayground />
      </section>

      {/* --- COMPARISON TABLE SECTION --- */}
      <section id="comparison" className="py-24 max-w-5xl mx-auto px-6 scroll-mt-24">
        
        <div className="text-center mb-16 space-y-3">
          <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
            The Benchmark
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Traditional Apps vs. Arusuvai Tech
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional trackers depend on generic templates. Here is how we redefine accuracy.
          </p>
        </div>

        {/* High Contrast Table */}
        <div className="glass-panel rounded-3xl border border-white/10 bg-slate-900/20 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/10">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics & Scope</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Traditional Trackers</th>
                <th className="p-5 text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Arusuvai Tech
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              <tr>
                <td className="p-5 font-bold text-slate-200">Ghee & Tadka Impact</td>
                <td className="p-5 text-slate-500">Unaccounted or static estimates</td>
                <td className="p-5 font-semibold text-emerald-300 bg-emerald-500/[0.02]">Dynamic Tadka Coefficient tuning</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-slate-200">Grain Databases</td>
                <td className="p-5 text-slate-500">Primarily wheat and white rice</td>
                <td className="p-5 font-semibold text-emerald-300 bg-emerald-500/[0.02]">Regional millets & high-fiber grain profiles</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-slate-200">Spice Tracking</td>
                <td className="p-5 text-slate-500">Zero biochemical tracking</td>
                <td className="p-5 font-semibold text-emerald-300 bg-emerald-500/[0.02]">Metabolic digestive synergy optimization</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-slate-200">Visual Tracking Accuracy</td>
                <td className="p-5 text-slate-500">Manual ingredient matching</td>
                <td className="p-5 font-semibold text-emerald-300 bg-emerald-500/[0.02]">Automated volumetric recipe mapping</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* --- EARLY ACCESS WAITLIST --- */}
      <EarlyAccessForm />

      {/* --- USER FEEDBACK --- */}
      <FeedbackForm />

      <Footer onAdminClick={() => navigateTo("/admin")} />
    </div>
  );
}
