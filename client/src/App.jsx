import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import AddProblem from "./pages/AddProblem";
import ProblemPage from "./pages/ProblemPage";

import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Navbar from "./layout/Navbar";
import AdminRoute from "./components/AdminRoute";
import { ThemeProvider } from "./components/Theme-provider";
import PlaylistPage from "./pages/Playlist";
import ProfilePage from "./pages/Profile";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: `
            bg-slate-950 text-slate-100 border border-slate-200
            dark:bg-white dark:text-slate-950 dark:border-slate-800
            rounded-lg px-4 py-3
          `,
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#dcfce7",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
        containerStyle={{
          bottom: 16,
          right: 16,
        }}
      />

      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route
            index
            element={authUser ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="problem"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route
            path="profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />

          <Route
            path="playlist"
            element={authUser ? <PlaylistPage /> : <Navigate to="/login" />}
          />

          <Route
            path="problem/:id"
            element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
          />

          <Route element={<AdminRoute />}>
            <Route
              path="add-problem"
              element={authUser ? <AddProblem /> : <Navigate to="/login" />}
            />
          </Route>
        </Route>

        <Route
          path="signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        
        <Route
          path="login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;