/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center ${
      scrolled 
        ? "bg-slate-950/80 border-b border-white/5 shadow-lg shadow-emerald-500/[0.02]" 
        : "bg-transparent"
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4.5 h-4.5 text-slate-950 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            Arusuvai AI Tech
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => handleScrollTo("ai-playground")}
            className="text-xs font-bold text-slate-400 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            Playground
          </button>
          <button
            onClick={() => handleScrollTo("features-grid")}
            className="text-xs font-bold text-slate-400 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => handleScrollTo("comparison")}
            className="text-xs font-bold text-slate-400 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            Comparison
          </button>
          <button
            onClick={() => handleScrollTo("early-access")}
            className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer hover:shadow-lg transition-all"
          >
            Early Access
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/5 p-6 flex flex-col gap-4 shadow-2xl md:hidden">
          <button
            onClick={() => handleScrollTo("ai-playground")}
            className="text-left py-2 text-sm font-bold text-slate-400 hover:text-white"
          >
            Playground
          </button>
          <button
            onClick={() => handleScrollTo("features-grid")}
            className="text-left py-2 text-sm font-bold text-slate-400 hover:text-white"
          >
            Features
          </button>
          <button
            onClick={() => handleScrollTo("comparison")}
            className="text-left py-2 text-sm font-bold text-slate-400 hover:text-white"
          >
            Comparison
          </button>
          <button
            onClick={() => handleScrollTo("early-access")}
            className="w-full btn-primary py-3 rounded-xl font-bold text-sm text-white text-center mt-2"
          >
            Early Access
          </button>
        </div>
      )}
    </nav>
  );
}
