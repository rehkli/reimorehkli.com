import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mint flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border-4 border-teal p-8 shadow-lg">
          <div className="text-center mb-8">
            <img
              src="/valge logo.svg"
              alt="Reimo Rehkli"
              className="h-16 mx-auto mb-4"
              style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(76%) saturate(478%) hue-rotate(130deg) brightness(93%) contrast(93%)' }}
            />
            <h1 className="text-2xl font-black text-teal">Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl font-semibold text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-teal font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-teal font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lemon text-teal px-6 py-3 rounded-full font-black border-4 border-teal shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
