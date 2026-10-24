import { useAuth } from './AuthContext';
import AuthForm from './AuthForm';
import { Routes, Route, Navigate, Link, NavLink, useLocation } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <Link to="/" className="brand">MyApp</Link>
      <nav className="nav">
        {user ? (
          <>
            <span className="nav-user">{user.email}</span>
            <button className="btn btn-ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Log in</NavLink>
            <NavLink to="/signup" className="btn btn-primary">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="page muted">Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

function Home() {
  const { user } = useAuth();
  const name = user.email.split('@')[0];
  return (
    <main className="page">
      <h1 className="title">Welcome back, {name}</h1>
      <p className="muted">You're signed in.</p>
      <section className="card-grid">
        <div className="card">
          <span className="label">Email</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="card">
          <span className="label">User ID</span>
          <span className="value">#{user.id}</span>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
      </Routes>
    </>
  );
}
