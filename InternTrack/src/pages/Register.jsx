import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import ThemeToggle from '../components/ThemeToggle';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
       return setError('Please fill all required fields.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      };
      const { data } = await api.post('/auth/register', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const isInvalid = (field) => error && !formData[field];

  return (
    <div className="auth-layout" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '5%', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <div style={{ position: 'absolute', top: '1.5rem', left: '5%', zIndex: 100 }} className="logo">
        <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          JobNova
        </Link>
      </div>

      <div className="glass-panel">
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <p className="subtitle" style={{ textAlign: 'center' }}>Create your account to start tracking internships</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form" noValidate>
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name" 
                className={isInvalid('name') ? 'is-invalid' : ''}
              />
            </div>
            {isInvalid('name') && <span className="validation-feedback">Name is required</span>}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                className={isInvalid('email') ? 'is-invalid' : ''}
              />
            </div>
            {isInvalid('email') && <span className="validation-feedback">Email is required</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password" 
                className={isInvalid('password') ? 'is-invalid' : ''}
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
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password" 
                className={(error === 'Passwords do not match.') ? 'is-invalid' : ''}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
             {error === 'Passwords do not match.' && <span className="validation-feedback">Passwords do not match</span>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
