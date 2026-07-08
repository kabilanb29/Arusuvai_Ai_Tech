/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, Send, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    category: "General Feedback",
    message: ""
  });

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    "General Feedback",
    "Bug Report",
    "Feature Suggestion",
    "General Query"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || formData.rating === 0 || !formData.message) {
      setErrorMessage("Please fill in all fields and select a star rating.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit feedback.");
      }

      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="user-feedback" className="py-20 bg-slate-950/20 border-t border-white/5 relative overflow-hidden scroll-mt-24">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[140px] -z-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl relative">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="feedback-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" /> Share Your Thoughts
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                    Help Us Calibrate Arusuvai
                  </h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    Your suggestions shape the future of local culinary intelligence. Let us know how we're doing.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating System */}
                  <div className="flex flex-col items-center gap-3 py-2 bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      How would you rate the experience?
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="focus:outline-none p-1 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            className={`w-8 h-8 transition-all ${
                              star <= (hoveredStar ?? formData.rating)
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                                : "text-slate-600 fill-transparent hover:text-slate-400"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {formData.rating > 0 && (
                      <span className="text-xs font-semibold text-amber-400 animate-pulse">
                        {formData.rating === 1 && "Need Improvements 😟"}
                        {formData.rating === 2 && "Fair Experience 😐"}
                        {formData.rating === 3 && "Good & Functional 🙂"}
                        {formData.rating === 4 && "Great App! 😀"}
                        {formData.rating === 5 && "Outstanding Calibration! 🚀"}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Neha Patel"
                        disabled={submitting}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="neha@gmail.com"
                        disabled={submitting}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Feedback Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={submitting}
                      className="bg-slate-900 border border-white/10 rounded-xl p-4 focus:border-emerald-500 outline-none text-white text-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comments/Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 ml-1">Your Comments</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your detailed feedback or suggest healthy replacements you'd love to see..."
                      disabled={submitting}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald-500 focus:bg-white/[0.08] outline-none text-white text-sm transition-all disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-4 rounded-xl font-bold text-sm text-white mt-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Calibrating Feedback Submission...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="feedback-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="flex flex-col items-center text-center space-y-6 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Thank You!</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    We've registered your feedback. Your input helps us build the ultimate precision nutrition suite for Indian kitchens.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      email: "",
                      rating: 0,
                      category: "General Feedback",
                      message: ""
                    });
                    setSubmitted(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500/15 transition-all"
                >
                  Submit Another Response
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
