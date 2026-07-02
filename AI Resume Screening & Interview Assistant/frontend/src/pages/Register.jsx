import { useState } from "react";
import { BrainCircuit, Lock, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Recruiter",
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
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Registration failed. Please try again."
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
            <p>Recruitment Intelligence Platform</p>
          </div>
        </div>

        <div className="hero-copy">
          <span>Create workspace</span>
          <h2>Start screening candidates with AI-powered hiring insights.</h2>
          <p>
            Upload resumes, create job roles, generate match scores, and make
            better hiring decisions.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Create account</h2>
          <p>Register as HR or Recruiter to continue.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full Name</label>
          <div className="input-group">
            <UserRound size={18} />
            <input
              type="text"
              name="full_name"
              placeholder="Praburam R"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <label>Role</label>
          <select
            name="role"
            className="select-input"
            value={form.role}
            onChange={handleChange}
          >
            <option value="HR">HR</option>
            <option value="Recruiter">Recruiter</option>
          </select>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
