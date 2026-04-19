import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ChevronDown,
  ChevronUp,
  Trash2,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileX,
  Loader2,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8000/api';

const likelihoodConfig = {
  high: { color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", label: "High" },
  medium: { color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", label: "Medium" },
  low: { color: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", label: "Low" },
};

function formatDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function HistoryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await axios.delete(`${API}/history/${item.id}`);
      onDelete(item.id);
    } catch {
      setDeleting(false);
    }
  };

  const topCondition = item.conditions?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      data-testid={`history-card-${item.id}`}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-0.5 transition-transform duration-300"
    >
      {/* Card Header */}
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
        data-testid={`history-expand-${item.id}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
          </div>
          <p className="text-sm font-medium text-slate-800 line-clamp-2">{item.symptoms}</p>
          <div className="mt-2 flex items-center flex-wrap gap-2">
            {topCondition && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Top:</span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {topCondition.name}
                </span>
              </div>
            )}
            {item.is_emergency && (
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                Emergency
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDelete}
            data-testid={`delete-btn-${item.id}`}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 p-5 space-y-4">
              {/* Conditions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                  <h4 className="text-sm font-semibold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Possible Conditions
                  </h4>
                </div>
                <div className="space-y-2">
                  {item.conditions.map((cond, i) => {
                    const cfg = likelihoodConfig[cond.likelihood] || likelihoodConfig.low;
                    return (
                      <div key={i} className={`border rounded-xl p-3 ${cfg.color}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                            <div>
                              <p className="font-semibold text-xs">{cond.name}</p>
                              <p className="text-xs mt-0.5 opacity-80">{cond.description}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0">{cfg.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                  <h4 className="text-sm font-semibold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Recommended Next Steps
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {item.next_steps.map((step, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-4 h-4 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-xs text-blue-700">{item.disclaimer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/history`);
      setHistory(data);
    } catch {
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Check History
          </h1>
        </div>
        <p className="text-slate-500 text-sm ml-13 mt-1">
          Review your past symptom checks and AI-generated educational insights.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        data-testid="history-disclaimer"
        className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6 flex gap-3"
      >
        <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="text-sm text-blue-700">
          <strong>Reminder:</strong> All information shown is for <strong>educational purposes only</strong> and does not constitute medical advice.
        </p>
      </motion.div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-16" data-testid="history-loading">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-slate-500 text-sm">Loading history...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm" data-testid="history-error">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-testid="history-empty"
          className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center text-center"
        >
          <FileX className="w-12 h-12 text-slate-300 mb-3" strokeWidth={1.5} />
          <p className="text-slate-700 font-medium">No history yet</p>
          <p className="text-slate-400 text-sm mt-1">Your past symptom checks will appear here.</p>
        </motion.div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-4" data-testid="history-list">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
            {history.length} check{history.length !== 1 ? "s" : ""} found
          </p>
          <AnimatePresence>
            {history.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
