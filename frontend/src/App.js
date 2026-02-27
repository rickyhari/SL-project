import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Dashboard from "./pages/Dashboard";
import QnA from "./pages/QnA";
import CompareClubs from "./pages/CompareClubs";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/result"
          element={
            <ProtectedRoute>
              <QuizResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs"
          element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs/:id"
          element={
            <ProtectedRoute>
              <ClubDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs/compare"
          element={
            <ProtectedRoute>
              <CompareClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qna"
          element={
            <ProtectedRoute>
              <QnA />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
