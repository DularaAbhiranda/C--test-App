import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Editor from './pages/Editor';
import ArticlePage from './pages/ArticlePage';
import Profile from './pages/Profile';

function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/@:username" element={<Profile />} />
          <Route
            path="/settings"
            element={<RequireAuth><Settings /></RequireAuth>}
          />
          <Route
            path="/editor"
            element={<RequireAuth><Editor /></RequireAuth>}
          />
          <Route
            path="/editor/:slug"
            element={<RequireAuth><Editor /></RequireAuth>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
