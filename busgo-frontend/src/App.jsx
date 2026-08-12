import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Seats from "./pages/Seats";
import Trips from "./pages/Trips";
import Admin from "./pages/Admin";

import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* GLOBAL HEADER */}
        <Header />

        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* BOOKING */}
          <Route path="/seats/:id" element={<Seats />} />

          {/* USER BOOKINGS */}
          <Route path="/trips" element={<Trips />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
