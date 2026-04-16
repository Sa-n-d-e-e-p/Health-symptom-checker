import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  Activity,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

const likelihoodConfig = {
  high: { color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", label: "High" },
  medium: { color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", label: "Medium" },
  low: { color: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", label: "Low" },
};

const exampleSymptoms = [
  "Headache, fever 38.5°C, sore throat for 2 days",
  "Chest tightness, shortness of breath, fatigue",
  "Stomach pain, nausea, loss of appetite since yesterday",
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await axios.post(`${API}/symptoms/check`, { symptoms });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms("");
    setError("");
  };

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-blue-100">
          <Activity className="w-3.5 h-3.5" strokeWidth={2} />
          Educational Tool Only
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-3"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Healthcare Symptom Checker
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto">
          Describe your symptoms and get AI-powered educational insights about possible conditions and recommended next steps.
        </p>
      </motion.div>

      {/* Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        data-testid="disclaimer-banner"
        className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-8 flex gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-blue-800">Medical Disclaimer</p>
          <p className="text-sm text-blue-700 mt-0.5">
            This tool is for <strong>educational purposes only</strong> and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="md:col-span-1"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Describe Symptoms
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                data-testid="symptom-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Headache, fever 38.5°C, sore throat for 2 days..."
                className="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm p-4 bg-slate-50 min-h-[140px] resize-y text-slate-800 placeholder-slate-400 outline-none transition-all"
                disabled={loading}
              />

              {/* Example chips */}
              <div className="mt-3 mb-4">
                <p className="text-xs text-slate-400 mb-2 font-medium">Try an example:</p>
                <div className="flex flex-col gap-1.5">
                  {exampleSymptoms.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      data-testid={`example-symptom-${i}`}
                      onClick={() => setSymptoms(ex)}
                      className="text-left text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-100 line-clamp-1"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                data-testid="check-symptoms-btn"
                disabled={loading || !symptoms.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full py-3 text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" strokeWidth={1.5} />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                </div>
                <p className="text-slate-700 font-medium text-base">Analyzing symptoms securely...</p>
                <p className="text-slate-400 text-sm mt-1">Consulting AI medical knowledge base</p>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-testid="error-message"
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-testid="results-container"
                className="space-y-4"
              >
                {/* Possible Conditions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Possible Conditions
                      </h3>
                    </div>
                    <button
                      onClick={handleReset}
                      data-testid="reset-btn"
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      New Check
                    </button>
                  </div>
                  <div className="space-y-3">
                    {result.conditions.map((cond, i) => {
                      const cfg = likelihoodConfig[cond.likelihood] || likelihoodConfig.low;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          data-testid={`condition-card-${i}`}
                          className={`border rounded-xl p-4 ${cfg.color}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                              <div>
                                <p className="font-semibold text-sm">{cond.name}</p>
                                <p className="text-xs mt-0.5 opacity-80">{cond.description}</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0 mt-0.5">
                              {cfg.label}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Recommended Next Steps
                    </h3>
                  </div>
                  <ul className="space-y-2" data-testid="next-steps-list">
                    {result.next_steps.map((step, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        data-testid={`next-step-${i}`}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {step}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Result Disclaimer */}
                <div
                  data-testid="result-disclaimer"
                  className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl flex gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-xs text-blue-700">{result.disclaimer}</p>
                </div>
              </motion.div>
            )}

            {!result && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] text-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
                </div>
                <p className="text-slate-700 font-medium">Enter your symptoms to get started</p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">
                  Describe what you're experiencing and our AI will provide educational insights
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
