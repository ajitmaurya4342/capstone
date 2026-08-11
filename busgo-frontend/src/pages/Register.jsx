import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/register", f);
      login(r.data);
      nav("/");
    } catch (x) {
      alert(x.response?.data?.message || "Registration failed");
    }
  };
  return (
    <main>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button>Register</button>
      </form>
    </main>
  );
}
