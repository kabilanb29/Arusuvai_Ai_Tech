/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Ticket, 
  Users, 
  CheckCircle2, 
  Share2, 
  ClipboardCheck, 
  Database, 
  Trash2, 
  Calendar, 
  MapPin, 
  Target, 
  Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WaitlistUser {
  name: string;
  email: string;
  city: string;
  goal: string;
  pioneerNumber: number;
  registeredAt: string;
}

export default function EarlyAccessForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    goal: "Weight Management"
  });

  const [submitted, setSubmitted] = useState(false);
  const [pioneerNumber, setPioneerNumber] = useState(0);
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Database live count state (kept private)
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  const fetchWaitlistCount = async () => {
    try {
      const res = await fetch("/api/waitlist/count");
      if (res.ok) {
        const data = await res.json();
        setWaitlistCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching waitlist count:", err);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit request.");
      }

      const result = await res.json();
      if (result.success) {
        setPioneerNumber(result.user.pioneerNumber);
        setSubmitted(true);
        fetchWaitlistCount(); // Refresh DB count dynamically
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    setCopying(true);
    navigator.clipboard.writeText("https://arusuvai.tech/join");
    setTimeout(() => setCopying(false), 2000);
  };

  // Base slot offsets for premium count down
  const baseSlotsTaken = 58;
  const totalSlotsRemaining = Math.max(0, 1000 - (baseSlotsTaken + waitlistCount));

  return (
    <section id="early-access" className="py-20 relative overflow-hidden">
      {/* Absolute glow decorative vectors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl relative">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                    Join the Revolution
                  </h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    Be among the first 1,000 pioneers to experience precision local nutrition.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Arjun Sharma"
                      disabled={loading}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="arjun@email.com"
                      disabled={loading}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bengaluru"
                      disabled={loading}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Primary Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      disabled={loading}
                      className="bg-slate-900 border border-white/10 rounded-xl p-4 focus:border-emerald-500 outline-none text-white text-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <option>Weight Management</option>
                      <option>Muscle Optimization</option>
                      <option>Longevity & Vitality</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 btn-primary py-4 rounded-xl font-bold text-sm text-white mt-4 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin" /> Calibrating Slot Registration...
                      </>
                    ) : (
                      "Request Early Access"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="congrats-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="flex flex-col items-center text-center space-y-8"
              >
                {/* Success Ticket/Badge */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">You're on the list!</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Welcome to Arusuvai Tech, <strong>{formData.name}</strong>. We've registered your priority slot.
                  </p>
                </div>

                {/* Gimmicky glow-morphic pioneer pass */}
                <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950 p-6 overflow-hidden shadow-2xl">
                  {/* Subtle card glows */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl"></div>

                  {/* Pass details */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 text-left">
                    <div>
                      <p className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase">Pioneer Pass</p>
                      <p className="text-base font-bold text-white mt-0.5">Arusuvai Tech</p>
                    </div>
                    <Ticket className="w-8 h-8 text-emerald-400 opacity-80" />
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Member</span>
                        <p className="text-xs font-bold text-slate-200 truncate">{formData.name}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Queue Slot</span>
                        <p className="text-xs font-black text-emerald-400">#{pioneerNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Location</span>
                        <p className="text-xs font-semibold text-slate-300 truncate">{formData.city || "Bengaluru"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Target Path</span>
                        <p className="text-xs font-semibold text-slate-300 truncate">{formData.goal}</p>
                      </div>
                    </div>
                  </div>

                  {/* Barcode representation */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-1.5">
                    <div className="h-6 w-full bg-slate-900 border border-white/5 flex items-center justify-around px-2 opacity-60">
                      {[1,3,2,1,4,2,3,1,2,1,3,1,4,2,1,3,2].map((w, idx) => (
                        <div key={idx} className="bg-slate-300 h-full" style={{ width: `${w * 1.5}px` }}></div>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase">ARU-{pioneerNumber}-VIP</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center">
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {copying ? (
                      <>
                        <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Link Copied
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" /> Share Invite Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFormData({ name: "", email: "", city: "", goal: "Weight Management" });
                      setSubmitted(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center gap-1 hover:bg-emerald-500/15 transition-all"
                  >
                    Register another slot
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </section>
  );
}

