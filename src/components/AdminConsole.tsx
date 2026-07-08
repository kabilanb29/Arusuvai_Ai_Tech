/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Database,
  Trash2,
  MapPin,
  Target,
  Activity,
  LogOut,
  RefreshCw,
  Lock,
  Search,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Star
} from "lucide-react";
import { motion } from "motion/react";
import { WaitlistUser, FeedbackEntry } from "../types";

interface AdminConsoleProps {
  onClose: () => void;
}

export default function AdminConsole({ onClose }: AdminConsoleProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"waitlist" | "feedback">("waitlist");

  // Data states
  const [waitlist, setWaitlist] = useState<WaitlistUser[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Waitlist search/filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGoal, setFilterGoal] = useState("all");
  
  // Feedback search/filters
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFilterCategory, setFeedbackFilterCategory] = useState("all");
  const [feedbackFilterRating, setFeedbackFilterRating] = useState("all");
  
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  // Check if password exists in localStorage on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem("arusuvai_admin_password");
    if (savedPassword) {
      verifyPasswordOnServer(savedPassword, true);
    }
  }, []);

  // Verify passcode with server
  const verifyPasswordOnServer = async (pass: string, silent = false) => {
    if (!silent) setVerifying(true);
    setAuthError("");
    try {
      const res = await fetch("/api/waitlist/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: pass })
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword(pass);
        localStorage.setItem("arusuvai_admin_password", pass);
        fetchWaitlistData(pass);
        fetchFeedbackData(pass);
      } else {
        if (!silent) {
          setAuthError("Incorrect admin passcode. Please try again.");
          localStorage.removeItem("arusuvai_admin_password");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (!silent) setAuthError("Server communication error. Please try again.");
    } finally {
      if (!silent) setVerifying(false);
    }
  };

  // Fetch all waitlist entries from backend securely
  const fetchWaitlistData = async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        headers: {
          "Authorization": `Bearer ${pass}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWaitlist(data);
      } else if (res.status === 401) {
        handleLogout();
        setAuthError("Session expired. Please log in again.");
      }
    } catch (err) {
      console.error("Error loading waitlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all feedback entries from backend securely
  const fetchFeedbackData = async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        headers: {
          "Authorization": `Bearer ${pass}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      } else if (res.status === 401) {
        handleLogout();
        setAuthError("Session expired. Please log in again.");
      }
    } catch (err) {
      console.error("Error loading feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError("Please enter a passcode.");
      return;
    }
    verifyPasswordOnServer(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("arusuvai_admin_password");
    setWaitlist([]);
    setFeedback([]);
    setSearchTerm("");
    setFeedbackSearch("");
  };


  // Delete waitlist record securely
  const handleDeleteRecord = async (email: string) => {
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the waitlist record for "${email}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleteStatus(`Removing ${email}...`);
    try {
      const res = await fetch("/api/waitlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setDeleteStatus("Successfully removed!");
        fetchWaitlistData(password);
        setTimeout(() => setDeleteStatus(null), 3000);
      } else {
        const errData = await res.json();
        setDeleteStatus(`Error: ${errData.error || "Could not delete"}`);
        setTimeout(() => setDeleteStatus(null), 4000);
      }
    } catch (err) {
      console.error("Error deleting registration:", err);
      setDeleteStatus("Network error occurred.");
      setTimeout(() => setDeleteStatus(null), 4000);
    }
  };

  // Delete feedback record securely
  const handleDeleteFeedback = async (email: string, submittedAt: string) => {
    const confirmed = window.confirm(`Are you absolutely sure you want to delete the feedback from "${email}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleteStatus(`Removing feedback...`);
    try {
      const res = await fetch("/api/feedback", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ email, submittedAt })
      });

      if (res.ok) {
        setDeleteStatus("Feedback removed!");
        fetchFeedbackData(password);
        setTimeout(() => setDeleteStatus(null), 3000);
      } else {
        const errData = await res.json();
        setDeleteStatus(`Error: ${errData.error || "Could not delete"}`);
        setTimeout(() => setDeleteStatus(null), 4000);
      }
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setDeleteStatus("Network error occurred.");
      setTimeout(() => setDeleteStatus(null), 4000);
    }
  };

  // Export waitlist database to CSV
  const exportToCSV = () => {
    if (waitlist.length === 0) return;
    
    // Headers
    const headers = ["Pioneer Slot", "Full Name", "Email Address", "City", "Primary Goal", "Registered At"];
    
    // Rows
    const rows = waitlist.map(u => [
      `#${u.pioneerNumber}`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${(u.city || "").replace(/"/g, '""')}"`,
      `"${(u.goal || "").replace(/"/g, '""')}"`,
      `"${new Date(u.registeredAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Arusuvai_Waitlist_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export feedback database to CSV
  const exportFeedbackToCSV = () => {
    if (feedback.length === 0) return;

    const headers = ["Full Name", "Email Address", "Rating", "Category", "Message", "Submitted At"];
    const rows = feedback.map(f => [
      `"${f.name.replace(/"/g, '""')}"`,
      `"${f.email.replace(/"/g, '""')}"`,
      f.rating,
      `"${f.category.replace(/"/g, '""')}"`,
      `"${f.message.replace(/"/g, '""')}"`,
      `"${new Date(f.submittedAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Arusuvai_Feedback_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search computation (Waitlist)
  const filteredUsers = waitlist.filter(user => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.city && user.city.toLowerCase().includes(query)) ||
      (user.goal && user.goal.toLowerCase().includes(query));

    const matchesGoal = filterGoal === "all" || user.goal === filterGoal;

    return matchesSearch && matchesGoal;
  });

  // Filter & Search computation (Feedback)
  const filteredFeedback = feedback.filter(item => {
    const query = feedbackSearch.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query);

    const matchesCategory = feedbackFilterCategory === "all" || item.category === feedbackFilterCategory;
    const matchesRating = feedbackFilterRating === "all" || String(item.rating) === feedbackFilterRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  // Extract unique goals for dropdown filter
  const goals = Array.from(new Set(waitlist.map(u => u.goal).filter(Boolean)));


  return (
    <div className="fixed inset-0 z-50 bg-[#04060c]/95 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-6xl w-full bg-slate-900/40 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Rail */}
        <div className="border-b border-white/5 bg-slate-950/70 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Database className="w-4.5 h-4.5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                Arusuvai Waitlist Admin Console
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Server-Side Database (waitlist.json)</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-white transition-all cursor-pointer active:scale-95"
          >
            Exit Console
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {!isAuthenticated ? (
            /* Passcode Form Gate */
            <div className="max-w-md mx-auto py-12 md:py-20 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Security Gate Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Enter the server's administrative passcode to securely fetch the private pioneer sign-up database.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Passcode (e.g. admin123)"
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium text-left flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 text-left leading-normal flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Standard:</strong> To secure personal identities, the waitlist is never cached in public bundles. Access is fully gated on the server side using the password defined in <code>ADMIN_PASSWORD</code>.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/10 transition-transform active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying with Server...
                    </>
                  ) : (
                    <>
                      Verify Passcode <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Secure Admin Dashboard */
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-white/5 gap-6 mb-6 shrink-0">
                <button
                  onClick={() => setActiveTab("waitlist")}
                  className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === "waitlist"
                      ? "border-emerald-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Pioneer Waitlist ({waitlist.length})
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === "feedback"
                      ? "border-emerald-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  User Feedback ({feedback.length})
                </button>
              </div>

              {/* Analytics Header Row */}
              {activeTab === "waitlist" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Registrations */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pioneers Enrolled</span>
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-white">{waitlist.length}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wide">Live Persistent Records</p>
                    </div>
                  </div>

                  {/* Cities Represented */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cities Covered</span>
                      <MapPin className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-white">
                        {Array.from(new Set(waitlist.map(u => u.city?.toLowerCase().trim()).filter(Boolean))).length}
                      </p>
                      <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-wide">Geographic Footprint</p>
                    </div>
                  </div>

                  {/* Admin Session */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Authorization</span>
                      <Lock className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider truncate">Session Active</p>
                        <button
                          onClick={handleLogout}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer uppercase tracking-wider block mt-1"
                        >
                          Disconnect Console
                        </button>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Feedback submissions */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Reviews</span>
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-white">{feedback.length}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wide">Submissions Collected</p>
                    </div>
                  </div>

                  {/* Average Star Rating */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Rating</span>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-white">
                        {feedback.length > 0
                          ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
                          : "0.0"}
                        <span className="text-sm font-bold text-slate-500"> / 5.0</span>
                      </p>
                      <p className="text-[10px] text-amber-400 font-bold mt-1 uppercase tracking-wide">Pioneer satisfaction</p>
                    </div>
                  </div>

                  {/* Admin Session */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Authorization</span>
                      <Lock className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider truncate">Session Active</p>
                        <button
                          onClick={handleLogout}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer uppercase tracking-wider block mt-1"
                        >
                          Disconnect Console
                        </button>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Data Table controls & listings */}
              <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6 space-y-4">
                
                {activeTab === "waitlist" ? (
                  <>
                    {/* Waitlist Control Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Search & Filter */}
                      <div className="flex flex-wrap items-center gap-3 flex-1">
                        <div className="relative w-full sm:max-w-xs">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search by name, email, city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                          />
                        </div>

                        <select
                          value={filterGoal}
                          onChange={(e) => setFilterGoal(e.target.value)}
                          className="bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="all">All Fitness Goals</option>
                          {goals.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => fetchWaitlistData(password)}
                          disabled={loading}
                          title="Sync waitlist records"
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </button>
                      </div>

                      {/* Right: Export button */}
                      <div className="flex items-center gap-3 shrink-0">
                        {deleteStatus && (
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                            {deleteStatus}
                          </span>
                        )}

                        <button
                          onClick={exportToCSV}
                          disabled={filteredUsers.length === 0}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Download className="w-3.5 h-3.5" /> Export to CSV
                        </button>
                      </div>
                    </div>

                    {/* Waitlist Table */}
                    {loading && waitlist.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Querying local waitlist.json database...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="py-16 text-center space-y-2">
                        <p className="text-sm font-semibold text-slate-400">No pioneers match your search criteria.</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing your filters or adding a new test pioneer from the waitlist form below.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-900/30">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-950/40">
                              <th className="py-3 px-4">Pioneer Slot</th>
                              <th className="py-3 px-4">Full Name</th>
                              <th className="py-3 px-4">Email Address</th>
                              <th className="py-3 px-4">City</th>
                              <th className="py-3 px-4">Primary Goal</th>
                              <th className="py-3 px-4 text-right">Registration Date</th>
                              <th className="py-3 px-4 text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                            {filteredUsers.map((user, idx) => (
                              <tr key={user.email} className="hover:bg-white/[0.01] transition-colors group">
                                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                                  #{user.pioneerNumber || (124 + idx)}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-white">
                                  {user.name}
                                </td>
                                <td className="py-3.5 px-4 font-mono text-slate-400 select-all">
                                  {user.email}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {user.city || "Bengaluru"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-white/5 text-[10px] font-bold text-slate-300">
                                    <Target className="w-3 h-3 text-slate-500" /> {user.goal || "Weight Management"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400">
                                  {new Date(user.registeredAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => handleDeleteRecord(user.email)}
                                    title="Remove User Registration"
                                    className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-all cursor-pointer opacity-30 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Table Footer Stats */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 shrink-0">
                      <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{waitlist.length}</strong> pioneers</span>
                      <span className="font-mono">Secure Connection Established</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Feedback Control Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Search & Filter */}
                      <div className="flex flex-wrap items-center gap-3 flex-1">
                        <div className="relative w-full sm:max-w-xs">
                          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search keywords, comments, name..."
                            value={feedbackSearch}
                            onChange={(e) => setFeedbackSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                          />
                        </div>

                        <select
                          value={feedbackFilterCategory}
                          onChange={(e) => setFeedbackFilterCategory(e.target.value)}
                          className="bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="all">All Categories</option>
                          <option value="General Feedback">General Feedback</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Feature Suggestion">Feature Suggestion</option>
                          <option value="General Query">General Query</option>
                        </select>

                        <select
                          value={feedbackFilterRating}
                          onChange={(e) => setFeedbackFilterRating(e.target.value)}
                          className="bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="all">All Star Ratings</option>
                          <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                          <option value="4">4 Stars ⭐⭐⭐⭐</option>
                          <option value="3">3 Stars ⭐⭐⭐</option>
                          <option value="2">2 Stars ⭐⭐</option>
                          <option value="1">1 Star ⭐</option>
                        </select>

                        <button
                          onClick={() => fetchFeedbackData(password)}
                          disabled={loading}
                          title="Sync feedback records"
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </button>
                      </div>

                      {/* Right: Export button */}
                      <div className="flex items-center gap-3 shrink-0">
                        {deleteStatus && (
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                            {deleteStatus}
                          </span>
                        )}

                        <button
                          onClick={exportFeedbackToCSV}
                          disabled={filteredFeedback.length === 0}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Download className="w-3.5 h-3.5" /> Export to CSV
                        </button>
                      </div>
                    </div>

                    {/* Feedback Table */}
                    {loading && feedback.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Querying local feedback.json database...</p>
                      </div>
                    ) : filteredFeedback.length === 0 ? (
                      <div className="py-16 text-center space-y-2">
                        <p className="text-sm font-semibold text-slate-400">No feedback submissions match your criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-900/30">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-950/40">
                              <th className="py-3 px-4">Rating</th>
                              <th className="py-3 px-4">Category</th>
                              <th className="py-3 px-4">Reviewer</th>
                              <th className="py-3 px-4">Email</th>
                              <th className="py-3 px-4">Message</th>
                              <th className="py-3 px-4 text-right">Submitted At</th>
                              <th className="py-3 px-4 text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                            {filteredFeedback.map((item) => (
                              <tr key={item.submittedAt + item.email} className="hover:bg-white/[0.01] transition-colors group">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${
                                          s <= item.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-700"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                                    item.category === "Bug Report"
                                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                      : item.category === "Feature Suggestion"
                                      ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                                      : item.category === "General Query"
                                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                  }`}>
                                    {item.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-white">
                                  {item.name}
                                </td>
                                <td className="py-3.5 px-4 font-mono text-slate-400">
                                  {item.email}
                                </td>
                                <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={item.message}>
                                  {item.message}
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400">
                                  {new Date(item.submittedAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => handleDeleteFeedback(item.email, item.submittedAt)}
                                    title="Remove Feedback Entry"
                                    className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-all cursor-pointer opacity-30 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Table Footer Stats */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 shrink-0">
                      <span>Showing <strong>{filteredFeedback.length}</strong> of <strong>{feedback.length}</strong> reviews</span>
                      <span className="font-mono">Secure Connection Established</span>
                    </div>
                  </>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
