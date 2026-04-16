import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Stethoscope, History, HeartPulse } from "lucide-react";
import SymptomChecker from "@/pages/SymptomChecker";
import HistoryPage from "@/pages/HistoryPage";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-bold text-lg text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            SymptomCheck<span className="text-blue-600">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            data-testid="nav-checker"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            <Stethoscope className="w-4 h-4" strokeWidth={1.5} />
            Symptom Checker
          </NavLink>
          <NavLink
            to="/history"
            data-testid="nav-history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`
            }
          >
            <History className="w-4 h-4" strokeWidth={1.5} />
            History
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-slate-50">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<SymptomChecker />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
