import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './auth.css';

// One corner of the circuit board, drawn top-left. Mirrored for the other three.
const TRACE = 'M150 170 H330 L370 210 V330 L420 380';

function Corner({ transform, delay }) {
  return (
    <g transform={transform}>
      <rect className="lg-chip" x="40" y="148" width="100" height="44" rx="6" />
      {[158, 170, 182].map((y) => (
        <line key={y} className="lg-pin" x1="26" x2="40" y1={y} y2={y} />
      ))}
      <path className="lg-trace" d={TRACE} pathLength="1000" />
      <path className={`lg-pulse ${delay}`} d={TRACE} pathLength="1000" />
      <rect className="lg-node" x="146" y="166" width="8" height="8" rx="1.5" />
    </g>
  );
}

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7db4ff" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z" /><path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" strokeOpacity=".5" />
  </svg>
);

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) await signup(email, password, confirm);
      else await login(email, password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.join(', ') || data?.error || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg-page">
      <svg className="lg-traces" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Corner transform="" delay="" />
        <Corner transform="translate(1200 0) scale(-1 1)" delay="d2" />
        <Corner transform="translate(0 800) scale(1 -1)" delay="d3" />
        <Corner transform="translate(1200 800) scale(-1 -1)" delay="d4" />
      </svg>

      <form className="lg-card" onSubmit={submit}>
        <div className="lg-logo-row">
          <span className="lg-dots l" />
          <span className="lg-logo"><Logo /></span>
          <span className="lg-dots r" />
        </div>

        <h2 className="lg-title">{isSignup ? 'Create account' : 'Welcome Back'}</h2>
        <p className="lg-sub">
          {isSignup
            ? <>Already have an account? <Link to="/login">Log in</Link></>
            : <>Don't have an account yet? <Link to="/signup">Sign up</Link></>}
        </p>

        {error && <div className="lg-error">{error}</div>}

        <label className="lg-input">
          <span className="sr-only">Email address</span>
          <MailIcon />
          <input type="email" placeholder="Email address" autoComplete="email"
                 value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="lg-input">
          <span className="sr-only">Password</span>
          <LockIcon />
          <input type="password" placeholder="Password"
                 autoComplete={isSignup ? 'new-password' : 'current-password'}
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {isSignup && (
          <label className="lg-input">
            <span className="sr-only">Confirm password</span>
            <LockIcon />
            <input type="password" placeholder="Confirm password" autoComplete="new-password"
                   value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </label>
        )}

        <button className="lg-btn" type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Login'}
        </button>
      </form>
    </div>
  );
}
