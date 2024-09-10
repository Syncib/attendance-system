import React from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Student from "./pages/Student";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { getRoleFromToken } from "./utils/decodeToken";

function App() {
  const { user } = useAuthContext();
  const role = user?.token ? getRoleFromToken(user.token) : null;

  // Redirect to the appropriate page based on role
  const getRedirectPath = () => {
    if (role === "admin") return "/admin";
    if (role === "user") return "/student";
    return "/";
  };

  return (
    <Router>
      <Navbar />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={user ? <Navigate to={getRedirectPath()} /> : <Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to={getRedirectPath()} /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={getRedirectPath()} /> : <Register />}
          />
          <Route
            path="/student"
            element={
              user && role === "user" ? <Student /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin"
            element={
              user && role === "admin" ? <Admin /> : <Navigate to="/" />
            }
          />
          {/* Optional: Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
