import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import logo from "../../assets/logo.png";
import heroImg from "../../assets/register-hero.png";

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m4 4 16 16" />}
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
    <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

const CodeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const TrendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

const features = [
  { icon: <CodeIcon />, label: "Hands on training" },
  { icon: <UserIcon />, label: "Expert Mentors" },
  { icon: <BriefcaseIcon />, label: "Placement Support" },
  { icon: <TrendIcon />, label: "Career Growth" },
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Fill in all fields to create your account.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don’t match.");
      return;
    }
    // TODO: replace with your API call
    console.log("Register:", { ...form, role });
    navigate("/");
  };

  return (
    <main className="reg-page">
      <section className="reg-card">
        <div className="reg-left">
          <img src={logo} alt="Real-Tech" className="reg-logo" />

          <div className="reg-head">
            <h1>Create an Account</h1>
            <p>Sign up to get started.</p>
          </div>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <input
              className="reg-input"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />

            <input
              className="reg-input"
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <p className="reg-label">Sign up as:</p>
            <div className="reg-toggle" role="radiogroup" aria-label="Sign up as">
              {["student", "teacher"].map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={role === r}
                  className={`reg-toggle-btn ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r === "student" ? "Student" : "Teacher"}
                </button>
              ))}
            </div>

            <label className="reg-input reg-pass">
              <span className="reg-icon"><LockIcon /></span>
              <input
                type={show.password ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShow({ ...show, password: !show.password })}
                aria-label={show.password ? "Hide password" : "Show password"}
              >
                <EyeIcon off={show.password} />
              </button>
            </label>

            <label className="reg-input reg-pass">
              <span className="reg-icon"><LockIcon /></span>
              <input
                type={show.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
                aria-label={show.confirm ? "Hide password" : "Show password"}
              >
                <EyeIcon off={show.confirm} />
              </button>
            </label>

            {error && <p className="reg-error" role="alert">{error}</p>}

            <button type="submit" className="reg-submit">Create Account</button>

            <p className="reg-switch">
              Already have an account ? <Link to="/">Login.</Link>
            </p>

            <div className="reg-divider"><span>Or continue with</span></div>

            <button type="button" className="reg-google">
              <GoogleIcon /> Sign up with Google
            </button>
          </form>
        </div>

        <div className="reg-right">
          <div className="reg-hero">
            <img src={heroImg} alt="Where Technology Meets Opportunity" />
          </div>

          <ul className="reg-features">
            {features.map((f) => (
              <li key={f.label}>
                <span className="reg-feature-icon">{f.icon}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}