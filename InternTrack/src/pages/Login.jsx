import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please input valid credentials.");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const data = await login({ email, password });
      
      // Route based on user role from backend
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div style={{ position: 'absolute', top: '1.5rem', right: '5%', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <div style={{ position: 'absolute', top: '1.5rem', left: '5%', zIndex: 100 }} className="logo">
        <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          JobNova
        </Link>
      </div>

      <div className="glass-panel">
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <p className="subtitle" style={{ textAlign: 'center' }}>Welcome back! Please login to your account</p>
        
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleAuth} className="auth-form" noValidate>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className={error && !email ? 'is-invalid' : ''}
              />
            </div>
            {error && !email && <span className="validation-feedback">Email is required</span>}
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className={error && !password ? 'is-invalid' : ''}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {error && !password && <span className="validation-feedback">Password is required</span>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
