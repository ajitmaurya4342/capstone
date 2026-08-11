import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Seats from "./pages/Seats";
import Trips from "./pages/Trips";
import Admin from "./pages/Admin";
import "./styles.css";
function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <Link to="/">BusGo</Link>
      <span>
        {user ? (
          <>
            <Link to="/trips">My Trips</Link>
            {(user?.role || user?.user?.role || "").toString().toUpperCase().includes("ADMIN") && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seats/:id" element={<Seats />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
