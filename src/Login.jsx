import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import logo from "./assets/logo.jpg";
import "./Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("researcher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await login(email, password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot connect to server. Ensure backend is running." : "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(name, email, password, role);
      setSuccess("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const handleSubmit = isRegister ? handleRegister : handleLogin;

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="header" style={{ height: '50px', display: 'flex', alignItems: 'center', padding: '0 30px', background: 'rgba(170, 166, 166, 0.6)' }}>
        <div className="project-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logo} alt="logo" className="project-logo" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
          <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', color: '#0f172a' }}>StudentHub</span>
        </div>
      </div>

      <div className="login-wrapper">
        <div className="login-card">
          <h1>{isRegister ? "Create Account" : "Welcome back"}</h1>
          <p className="subtitle">
            {isRegister ? "Register to start collaborating on research projects" : "Sign in to your account to continue"}
          </p>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={role === "researcher" ? "active" : ""}
              onClick={() => setRole("researcher")}
            >
              Researcher
            </button>

            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                />
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="signin-btn">
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="register-text">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={toggleMode}
              style={{ cursor: "pointer", color: "#3b82f6", textDecoration: "underline" }}
            >
              {isRegister ? "Sign In" : "Create one"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
