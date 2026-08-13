import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header";

import Home from "./pages/Home";
import Seats from "./pages/Seats";
import Trips from "./pages/Trips";
import Admin from "./pages/Admin";

import "./styles.css";

function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Admin → Admin Dashboard
  if (user?.admin === true) {
    return <Admin />;
  }

  // Normal user → Home
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Dynamic Home */}
          <Route path="/" element={<HomeRoute />} />

          {/* Booking */}
          <Route path="/seats/:id" element={<Seats />} />

          {/* User bookings */}
          <Route path="/trips" element={<Trips />} />

          {/* Admin direct access */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
