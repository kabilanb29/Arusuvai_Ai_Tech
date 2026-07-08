/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingDown,
  Layers,
  Flame,
  ShieldCheck,
  Activity,
  ArrowRight,
  ChevronRight,
  Plus,
  Compass,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import InteractiveAppMockup from "./components/InteractiveAppMockup";
import AIPanelPlayground from "./components/AIPanelPlayground";
import EarlyAccessForm from "./components/EarlyAccessForm";
import Footer from "./components/Footer";
import AdminConsole from "./components/AdminConsole";
import FeedbackForm from "./components/FeedbackForm";

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
  
  // Bento Card 1: Live Oil & Ghee Slider state
  const [tadkaOil, setTadkaOil] = useState(30); // value from 0 to 100

  // Bento Card 2: Interactive Glycemic Index state
  const [selectedGrain, setSelectedGrain] = useState<"white-rice" | "millets">("white-rice");

  // Interactive Spice info state
  const [activeSpice, setActiveSpice] = useState<string>("turmeric");

  const spices = [
    {
      id: "turmeric",
      name: "Haldi (Turmeric)",
      benefit: "Anti-Inflammatory & Metabolic Catalyst",
      desc: "Curcumin, when paired with black pepper (piperine), increases absorption by 2000% and regulates glucose spikes."
    },
    {
      id: "ginger",
      name: "Adrak (Ginger)",
      benefit: "Digestive Catalyst & Thermogenesis Boost",
      desc: "Gingerols stimulate gastric enzymes, accelerates digestion, and boosts non-exercise thermogenesis (calorie burning)."
    },
    {
      id: "cumin",
      name: "Jeera (Cumin)",
      benefit: "Enzyme Secretion Booster",
      desc: "Stimulates pancreatic secretions and bile flow, speeding up the breakdown of dense carbohydrates and fats."
    }
  ];

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (currentPath === "/admin") {
    return <AdminConsole onClose={() => navigateTo("/")} />;
  }

  return (
    <div className="min-h-screen bg-[#070b15] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Now Calibrating for Bengaluru, Mumbai, & NCR
            </div>

            {/* Display Typography Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Precision Nutrition <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                for the Indian Palate
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ditch generic Western calorie-counters. Arusuvai Tech maps your meals using localized A2 ghee coefficient tuning, regional glycemic index calibrations, and metabolic spice synergy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleScrollTo("early-access")}
                className="btn-primary px-8 py-4 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                Request Priority Pass
              </button>
              
              <button
                onClick={() => handleScrollTo("ai-playground")}
                className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
              >
                Launch AI Lab <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Indian Ingredients</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.8x</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Macro Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">942</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pioneers Registered</p>
              </div>
            </div>

          </div>

          {/* Right Column: High Fidelity Mobile App Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractiveAppMockup />
          </div>

        </div>
      </header>

      {/* --- CORE FEATURES BENTO GRID --- */}
      <section id="features-grid" className="py-24 bg-slate-950/40 border-y border-white/5 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
              LOCALIZED ENGINEERING
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Why Generic Fitness Trackers Fail Indian Diets
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              Our culinary engineering team discovered four critical blindspots in Western fitness applications. Here is how we calibrated them.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card 1: Ghee/Oil Tadka Calibration (Interactive) */}
            <div className="md:col-span-7 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 relative flex flex-col justify-between overflow-hidden group min-h-[340px]">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Oil & Tadka Calorie Calibration</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  Standard databases classify a dry bowl of vegetables identically to a ghee-tempered subji. Use our slider below to see how our Tadka Coefficient alters calories instantly.
                </p>
              </div>

              {/* LIVE INTERACTIVE SLIDER DEMO */}
              <div className="mt-6 bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Tadka Volume Slider</span>
                  <span className="text-xs font-black text-amber-400">
                    +{Math.round(tadkaOil * 2.8)} Calories Added
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tadkaOil}
                  onChange={(e) => setTadkaOil(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Dry Steamed / Airfried</span>
                  <span>1 tbsp oil/ghee</span>
                  <span>Heavy Tadka (Dhaba)</span>
                </div>

                <p className="text-[11px] text-slate-400 italic pt-1 leading-normal">
                  <strong>Impact:</strong> {
                    tadkaOil < 25 
                      ? "Arusuvai Calibrated - Optimal heart-healthy cooking media with negligible lipid spike." 
                      : tadkaOil < 65 
                      ? "Standard Home-Style - Standard fats count. Fine for non-diet days, but slower fat-burning." 
                      : "Heavy Saturated Tadka - Extreme digestive load, spikes blood triglycerides and causes immediate post-meal lethargy."
                  }
                </p>
              </div>
            </div>

            {/* Bento Card 2: Glycemic Index Calibration (Interactive) */}
            <div className="md:col-span-5 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 relative flex flex-col justify-between overflow-hidden group min-h-[340px]">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Dynamic Glycemic Index Tuning</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Refined grains trigger insulin spikes that stall fat loss. Tap below to see how our grain substitutions flatten the blood sugar curve.
                </p>
              </div>

              {/* INTERACTIVE GRAIN SWITCHER AND MINI GRAPH */}
              <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGrain("white-rice")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      selectedGrain === "white-rice"
                        ? "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        : "bg-slate-900 text-slate-500 border border-transparent"
                    }`}
                  >
                    Polished White Rice
                  </button>
                  <button
                    onClick={() => setSelectedGrain("millets")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      selectedGrain === "millets"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-slate-900 text-slate-500 border border-transparent"
                    }`}
                  >
                    Foxtail Millet Mix
                  </button>
                </div>

                {/* SVG Mini Graph */}
                <div className="h-16 relative flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    {/* Glycemic curve paths */}
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
                          strokeWidth="2.5"
                          strokeLinecap="round"
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
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}
                    </AnimatePresence>
                    {/* Baseline */}
                    <line x1="5" y1="35" x2="95" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </svg>
                  
                  {/* Floating badge info */}
                  <div className="absolute top-0 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-white/5 text-slate-400">
                    {selectedGrain === "white-rice" ? "GI: 72 (High Saturated Spike)" : "GI: 51 (Sustained Release)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Spices as Digestive Engines */}
            <div className="md:col-span-6 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 relative flex flex-col justify-between overflow-hidden min-h-[340px]">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Digestive & Spice Optimization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Indian spices are biochemical enzymes, not just flavorings. Tap below to see how our engine profiles their metabolic utility.
                </p>
              </div>

              {/* Spice info switcher */}
              <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex gap-1.5">
                  {spices.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSpice(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        activeSpice === s.id
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {s.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <div className="min-h-[60px] flex flex-col justify-center">
                  <p className="text-[11px] font-bold text-white">
                    {spices.find((s) => s.id === activeSpice)?.benefit}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    {spices.find((s) => s.id === activeSpice)?.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Auto-Track Consumption */}
            <div className="md:col-span-6 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 relative flex flex-col justify-between overflow-hidden min-h-[340px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Auto-Track Consumption</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Skip tedious manual ingredient entries. Snapping a photo triggers pixel-density mapping models calibrated with dense Indian recipes, automatically calculating ghee levels, proteins, and regional carb loads.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scroll Down to Test</span>
                <button
                  onClick={() => handleScrollTo("ai-playground")}
                  className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  Go to AI Lab <ChevronRight className="w-3.5 h-3.5" />
                </button>
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
            Traditional fitness apps depend on Western food templates. Here is how we redefine accuracy.
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
