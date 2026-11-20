import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../../assets/logo.png";
import { requestPasswordReset, IS_MOCK } from "../../services/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 6 6v3" />
  </svg>
);

const MailCheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // countdown for the "Resend" button
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendLink = async () => {
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
      setCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    sendLink();
  };

  const handleResend = () => {
    if (cooldown > 0 || loading) return;
    sendLink();
  };

  const useDifferentEmail = () => {
    setSent(false);
    setError("");
    setCooldown(0);
  };

  return (
    <main className="fp-page">
      <section className="fp-card">
        <img src={logo} alt="Real-Tech" className="fp-logo" />

        {!sent ? (
          <form className="fp-body" onSubmit={handleSubmit} noValidate>
            <h1 className="fp-title">Forgot Password?</h1>
            <p className="fp-sub">Enter your email address to receive a password reset link.</p>
            <hr className="fp-rule" />

            <input
              className="fp-input"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              autoFocus
            />
            {error && <p className="fp-error" role="alert">{error}</p>}

            <button type="submit" className="fp-btn fp-btn-full fp-gap" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <Link to="/" className="fp-back">
              <BackIcon /> Back to Login
            </Link>
          </form>
        ) : (
          <div className="fp-body" aria-live="polite">
            <span className="fp-sent-icon"><MailCheckIcon /></span>
            <h1 className="fp-title">Check your email</h1>
            <p className="fp-sub">
              If an account exists for <strong>{email.trim()}</strong>, we’ve sent a password
              reset link to it. The link expires in 15 minutes.
            </p>
            <p className="fp-notice">Check your inbox for the password reset link.</p>
            <hr className="fp-rule" />

            {error && <p className="fp-error" role="alert">{error}</p>}

            <button
              type="button"
              className="fp-btn fp-btn-outline fp-btn-full"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
            >
              {loading ? "Sending…" : cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend link"}
            </button>

            <button type="button" className="fp-linkbtn" onClick={useDifferentEmail}>
              Use a different email
            </button>

            {IS_MOCK && (
              <p className="fp-dev">
                Dev mode: no email is sent. Open the reset page directly:{" "}
                <Link to="/reset-password/demo-token">/reset-password/demo-token</Link>
              </p>
            )}

            <Link to="/" className="fp-back">
              <BackIcon /> Back to Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}