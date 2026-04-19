import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Welcome Back</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Sign in to sync your symptom history</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !username || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
        </p>
      </motion.div>
    </main>
  );
}
