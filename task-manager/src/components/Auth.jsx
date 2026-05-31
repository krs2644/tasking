import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await axios.post(API + endpoint, payload);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="auth-bg">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">♛</div>
          <h1>TasKing</h1>
          <p>{isLogin ? "Welcome back, your tasks await." : "Start managing tasks like a king."}</p>
        </div>

        <div className="auth-tabs">
          <button className={isLogin ? "tab active" : "tab"} onClick={() => { setIsLogin(true); setError(""); }}>Sign In</button>
          <button className={!isLogin ? "tab active" : "tab"} onClick={() => { setIsLogin(false); setError(""); }}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`form-fields ${isLogin ? "login-fields" : "register-fields"}`}>
            {!isLogin && (
              <div className="form-group slide-in">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
          </div>

          {error && <div className="auth-error fade-in">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            <span>{loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</span>
          </button>
        </form>

      </div>
    </div>
  )
}