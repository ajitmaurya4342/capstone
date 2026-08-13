import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "../styles/Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [authModal, setAuthModal] = useState(null);
  console.log({ user });

  const isAdmin = user?.admin;

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          {/* LOGO */}
          <div className="logo" onClick={() => nav("/")}>
            <span className="logo-icon">🚌</span>

            <span>
              Bus<span>Go</span>
            </span>
          </div>

          {/* ACTIONS */}
          <div className="nav-actions">
            {!user ? (
              <>
                <button
                  className="login-btn"
                  onClick={() => setAuthModal("login")}
                >
                  Login
                </button>

                <button
                  className="signup-btn"
                  onClick={() => setAuthModal("register")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {!isAdmin && (
                  <button
                    className="my-bookings-btn"
                    onClick={() => nav("/trips")}
                  >
                    🎫 My Bookings
                  </button>
                )}

                <div className="user-profile">
                  <div className="user-avatar">
                    {(user?.name || user?.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="user-info">
                    <strong>{user?.name || user?.username || "User"}</strong>

                    <span>{isAdmin ? "Administrator" : "Passenger"}</span>
                  </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}
      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
