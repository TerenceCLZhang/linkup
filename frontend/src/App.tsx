import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import HomePage from "./pages/HomePage";
import { ProtectedRoute, PublicRoute } from "./components/AuthWrappers";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-5">
        <Loader className="size-12 animate-spin" />
        <span className="text-3xl font-semibold">Loading</span>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col w-full">
      <NavBar />

      <main className="flex items-center justify-center flex-col min-h-screen">
        <Routes>
          {/* Root route */}
          <Route path="/" element={authUser ? <HomePage /> : <LandingPage />} />

          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute user={authUser}>
                <LogInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute user={authUser}>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={authUser}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Routes available to all users */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
