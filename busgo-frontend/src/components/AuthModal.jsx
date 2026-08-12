import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AuthModal.css";

export default function AuthModal({ mode = "login", onClose }) {
  const { login } = useAuth();

  const [activeMode, setActiveMode] = useState(mode);

  const [loginForm, setLoginForm] = useState({
    email: "user@busgo.com",
    password: "User@123",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setError("");
    setActiveMode(newMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", loginForm);

      login(response.data);

      onClose();

      // Admin goes to admin dashboard
      const role = String(
        response.data?.role || response.data?.user?.role || "",
      ).toUpperCase();

      window.location.href = role.includes("ADMIN") ? "/admin" : "/";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", registerForm);

      login(response.data);

      onClose();

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="auth-modal">
        {/* CLOSE */}
        <button className="auth-close" onClick={onClose} type="button">
          ×
        </button>

        {/* LEFT SIDE */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              🚌
              <span>
                Bus<span>Go</span>
              </span>
            </div>

            <h2>
              Your journey
              <br />
              starts here.
            </h2>

            <p>
              Book comfortable buses, choose your favorite seat and travel with
              confidence.
            </p>

            <div className="auth-features">
              <div>
                <span>✓</span>
                Easy bus booking
              </div>

              <div>
                <span>✓</span>
                Secure payments
              </div>

              <div>
                <span>✓</span>
                Manage your bookings
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-content">
          {/* HEADER */}
          <div className="auth-header">
            <h2>
              {activeMode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p>
              {activeMode === "login"
                ? "Login to continue your journey"
                : "Join BusGo and start booking buses"}
            </p>
          </div>

          {/* SWITCH */}
          <div className="auth-tabs">
            <button
              type="button"
              className={activeMode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={activeMode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Sign Up
            </button>
          </div>

          {/* ERROR */}
          {error && <div className="auth-error">{error}</div>}

          {/* LOGIN */}
          {activeMode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label>Email address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="auth-field">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Signing in..." : "Login →"}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {activeMode === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-field">
                <label>Full name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="auth-field">
                <label>Email address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="auth-field">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
          )}

          <div className="auth-bottom">
            {activeMode === "login" ? (
              <>
                Don't have an account?
                <button type="button" onClick={() => switchMode("register")}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button type="button" onClick={() => switchMode("login")}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
