import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import logo from "../../assets/logo.png";
import { verifyResetToken, resetPassword } from "../../services/authApi";

const MIN_LENGTH = 8;

const EyeIcon = ({ off }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m4 4 16 16" />}
  </svg>
);

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 6 6v3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
);

const AlertIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16.5h.01" />
  </svg>
);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  // checking -> valid -> done   (or checking -> invalid)
  const [status, setStatus] = useState("checking");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1) check the link when the page opens
  useEffect(() => {
    let active = true;
    setStatus("checking");
    verifyResetToken(token)
      .then((ok) => active && setStatus(ok ? "valid" : "invalid"))
      .catch(() => active && setStatus("invalid"));
    return () => {
      active = false;
    };
  }, [token]);

  // 3) after success, go to login automatically
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(t);
  }, [status, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 2) save the new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don’t match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setStatus("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rp-page">
      <section className="rp-card">
        <img src={logo} alt="Real-Tech" className="rp-logo" />

        {status === "checking" && (
          <div className="rp-body" role="status">
            <p className="rp-sub">Verifying your reset link…</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="rp-body">
            <span className="rp-icon rp-icon-warn"><AlertIcon /></span>
            <h1 className="rp-title">Link expired or invalid</h1>
            <p className="rp-sub">
              This password reset link is no longer valid. Links expire after 15 minutes and
              can only be used once.
            </p>
            <Link to="/forgot-password" className="rp-btn rp-btn-full rp-gap">
              Request a new link
            </Link>
            <Link to="/" className="rp-back">
              <BackIcon /> Back to Login
            </Link>
          </div>
        )}

        {status === "valid" && (
          <form className="rp-body" onSubmit={handleSubmit} noValidate>
            <h1 className="rp-title">
              Reset Your <span>Password</span>
            </h1>
            <p className="rp-sub">Reset your password below</p>
            <hr className="rp-rule" />

            <div className="rp-fields">
              <label className="rp-input">
                <input
                  type={show.password ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  className="rp-eye"
                  onClick={() => setShow({ ...show, password: !show.password })}
                  aria-label={show.password ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={show.password} />
                </button>
              </label>

              <label className="rp-input">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirm"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="rp-eye"
                  onClick={() => setShow({ ...show, confirm: !show.confirm })}
                  aria-label={show.confirm ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={show.confirm} />
                </button>
              </label>
            </div>

            <p className={`rp-hint ${form.password.length >= MIN_LENGTH ? "ok" : ""}`}>
              At least {MIN_LENGTH} characters
            </p>
            {error && <p className="rp-error" role="alert">{error}</p>}

            <hr className="rp-rule" />

            <button type="submit" className="rp-btn rp-btn-full" disabled={loading}>
              {loading ? "Updating…" : "Update Password"}
            </button>

            <Link to="/" className="rp-back">
              <BackIcon /> Back to Login
            </Link>
          </form>
        )}

        {status === "done" && (
          <div className="rp-body" role="status">
            <span className="rp-icon rp-icon-ok"><CheckIcon /></span>
            <h1 className="rp-title">Password updated</h1>
            <p className="rp-sub">
              Your password has been changed. Taking you to the login page…
            </p>
            <Link to="/" className="rp-btn rp-btn-full rp-gap">
              Go to Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}