import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserCircle, Save, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    pre_existing_conditions: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/user/profile`);
      setProfile({
        age: data.age || "",
        gender: data.gender || "",
        pre_existing_conditions: data.pre_existing_conditions || ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await axios.post(`${API}/user/profile`, {
        age: parseInt(profile.age, 10),
        gender: profile.gender,
        pre_existing_conditions: profile.pre_existing_conditions
      });
      setMessage({ type: "success", text: "Medical profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Medical Profile
          </h1>
        </div>
        <p className="text-slate-500 text-sm ml-13 mt-1">
          Provide your baseline medical information to receive highly personalized AI symptom insights.
        </p>
      </motion.div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                required
                min="1"
                max="120"
                value={profile.age}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all bg-slate-50"
                placeholder="e.g. 34"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Biological Gender</label>
              <select
                name="gender"
                required
                value={profile.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all bg-slate-50"
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other / Transgender">Other / Transgender</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pre-existing Conditions (Optional)</label>
            <textarea
              name="pre_existing_conditions"
              value={profile.pre_existing_conditions}
              onChange={handleChange}
              rows="4"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all bg-slate-50 resize-y"
              placeholder="e.g. Asthma, Type 2 Diabetes, High Blood Pressure... (Leave blank if none)"
            />
            <p className="text-xs text-slate-400 mt-2">
              Our AI uses this context to drastically improve the safety and accuracy of condition predictions.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
