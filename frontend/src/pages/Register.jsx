import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/posts');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Registration failed.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✨</div>
          <h2>Create account</h2>
          <p>Join PostManager to get started</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">⚠️ {errors.general}</div>
        )}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.name[0]}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.email[0]}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-control"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <small style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{errors.password[0]}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              name="password_confirmation"
              className="form-control"
              placeholder="Repeat password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : '→ Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="link-to-login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
