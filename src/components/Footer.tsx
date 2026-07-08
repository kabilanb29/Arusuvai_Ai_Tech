/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Heart } from "lucide-react";

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 bg-slate-950 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand Left */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Arusuvai AI Tech
            </span>
          </button>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Your Personal AI Nutrition Companion for Everyday India. Helping you make better food choices with what you already have at home.
          </p>
        </div>

        {/* Info Right */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-400 justify-center md:justify-end">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <a href="#ai-playground" className="hover:text-white transition-colors">Playground</a>
            <a href="#features-grid" className="hover:text-white transition-colors">Features</a>
            <a href="#early-access" className="hover:text-white transition-colors">Join waitlist</a>
            <button
              onClick={onAdminClick}
              className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Admin Console
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
            <span>© {currentYear} Arusuvai AI Tech. Crafted in India with</span>
            <Heart className="w-3 h-3 text-rose-500 animate-pulse fill-rose-500" />
            <span>for healthy living.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
