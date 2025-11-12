import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";

// Routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to={"/login"} replace />;

  if (!authUser.isVerified) return <Navigate to={"/verify-email"} replace />;

  return children;
};

// Redirect authenticated users to messages page
const RedirectAuthenticatedUser = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authUser } = useAuthStore();

  if (authUser && authUser.isVerified)
    return <Navigate to={"/messages"} replace />;

  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

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
    <div className="flex items-center flex-col w-full min-h-screen">
      <Header />

      <main className="flex items-center justify-center flex-col w-full x-padding flex-1 container -mt-5">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <RedirectAuthenticatedUser>
                <LandingPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LogInPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected routes */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="flex justify-between w-full x-padding container mb-2">
        <p>
          Made by{" "}
          <a
            href="https://terenceclzhang-portfolio.vercel.app/"
            target="_blank"
          >
            Terence Zhang
          </a>
        </p>

        <p>
          <a href="https://github.com/TerenceCLZhang/linkup" target="_blank">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
