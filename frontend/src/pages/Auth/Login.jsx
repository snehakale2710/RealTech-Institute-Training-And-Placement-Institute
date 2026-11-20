import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../../assets/logo.png";
import heroImg from "../../assets/login-hero.png";

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m4 4 16 16" />}
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password to log in.");
      return;
    }
    // TODO: replace with your API call
    console.log("Login:", form);
    navigate("/dashboard"); // change to your real route once it exists
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-left">
          <img src={logo} alt="Real-Tech" className="login-logo" />

          <div className="login-head">
            <h1>Welcome Back!</h1>
            <p>Login to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span className="login-icon"><MailIcon /></span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </label>

            <label className="login-field">
              <span className="login-icon"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon off={showPassword} />
              </button>
            </label>

            {/* Change "#" to "/forgot-password" once that page exists */}
            <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="login-switch">
            Don’t have an account? <Link to="/register">Sign Up.</Link>
          </p>
        </div>

        <div className="login-right">
          <img src={heroImg} alt="Where Technology Meets Opportunity" />
        </div>
      </section>
    </main>
  );
}