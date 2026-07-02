import { useState } from "react";
import { BrainCircuit, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left-panel">
        <div className="auth-brand">
          <div className="auth-logo">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h1>ResumeAI</h1>
            <p>AI Resume Screening & Interview Assistant</p>
          </div>
        </div>

        <div className="hero-copy">
          <span>Recruit smarter</span>
          <h2>Screen resumes, rank candidates, and generate interview insights.</h2>
          <p>
            A modern AI-powered hiring dashboard for HR teams and recruiters.
          </p>
        </div>

        <div className="auth-metrics">
          <div>
            <h3>95%</h3>
            <p>Faster screening</p>
          </div>
          <div>
            <h3>AI</h3>
            <p>Match scoring</p>
          </div>
          <div>
            <h3>24/7</h3>
            <p>Hiring support</p>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Welcome back</h2>
          <p>Login to continue to your recruitment dashboard.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email Address</label>
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="prabu@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          New to ResumeAI? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
