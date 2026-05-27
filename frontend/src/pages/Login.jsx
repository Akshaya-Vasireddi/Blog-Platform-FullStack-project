import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('session') === 'expired';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm page-enter">
        {expired && (
          <div className="bg-amber-pale border border-amber/30 rounded-sm px-4 py-3 mb-6 text-sm font-sans text-amber-ink">
            Your session expired. Please sign in again.
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="font-body text-ink-muted">Sign in to continue writing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-2.5">
              <p className="font-sans text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center flex items-center gap-2 mt-2"
          >
            {loading && <div className="spinner w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center font-sans text-sm text-ink-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-ink font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
