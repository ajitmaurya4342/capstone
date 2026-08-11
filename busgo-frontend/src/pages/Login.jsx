import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState("user@busgo.com"),
    [password, setPassword] = useState("User@123"),
    [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/login", { email, password });
      login(r.data);
      const role = String(r.data?.role || r.data?.user?.role || "").toUpperCase();
      nav(role.includes("ADMIN") ? "/admin" : "/");
    } catch (x) {
      setError(x.response?.data?.message || "Login failed");
    }
  };
  return (
    <main>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      <p>{error}</p>
    </main>
  );
}
