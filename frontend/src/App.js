import React, { useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { Stethoscope, History, HeartPulse, LogOut, UserCircle } from "lucide-react";
import SymptomChecker from "@/pages/SymptomChecker";
import HistoryPage from "@/pages/HistoryPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ProfilePage from "@/pages/ProfilePage";
import { AuthProvider, AuthContext } from "@/context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        {isAuthenticated && (
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
            <NavLink
              to="/profile"
              data-testid="nav-profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <UserCircle className="w-4 h-4" strokeWidth={1.5} />
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 ml-2 rounded-full text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-slate-50">
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
