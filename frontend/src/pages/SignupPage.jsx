import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, AlertTriangle, Loader2, HeartPulse, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/auth/register`, { username, password });
      // Redirect to login on success
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white flex-row-reverse">
      {/* Right Side: Premium Blue Gradient Graphic (Reversed for variation) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <HeartPulse className="w-10 h-10 text-indigo-200" />
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>SymptomCheck AI</h1>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Start tracking your health safely.</h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Create a secure account to maintain an ongoing history of your symptoms and gain personalized AI insights over time.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-indigo-200 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
            <ShieldCheck className="w-5 h-5" /> 
            Military-grade data encryption
          </div>
        </motion.div>
      </div>

      {/* Left Side: Clean Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10"
        >
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Create Account</h1>
          <p className="text-slate-500 text-sm mb-8">Join the bleeding-edge of AI clinical safety.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-700 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-slate-50/50"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-slate-50/50"
                placeholder="Choose a secure password"
                minLength={6}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !username || password.length < 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-md hover:shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1">
            <span className="text-sm text-slate-500">Already have an account?</span>
            <Link to="/login" className="text-indigo-600 text-sm font-bold hover:underline transition-all">Sign in here</Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
