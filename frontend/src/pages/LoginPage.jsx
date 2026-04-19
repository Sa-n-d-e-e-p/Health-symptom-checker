import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Loader2, Activity, HeartPulse } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // FastAPI OAuth2PasswordRequestForm requires form-encoded data
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      
      const { data } = await axios.post(`${API}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      login(data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Side: Premium Blue Gradient Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <HeartPulse className="w-10 h-10 text-blue-200" />
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>SymptomCheck AI</h1>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Your intelligent health companion.</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Securely log in to analyze your symptoms, receive personalized clinical insights, and triage potential emergencies instantly.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-blue-200 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
            <Activity className="w-5 h-5" /> 
            HIPAA-compliant data isolation
          </div>
        </motion.div>
      </div>

      {/* Right Side: Clean Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10"
        >
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Welcome Back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to securely access your symptom history</p>

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
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-slate-50/50"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-slate-50/50"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !username || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-md hover:shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1">
            <span className="text-sm text-slate-500">Don't have an account?</span>
            <Link to="/register" className="text-blue-600 text-sm font-bold hover:underline transition-all">Create one here</Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
