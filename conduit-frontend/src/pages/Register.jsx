import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorList from '../components/ErrorList';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data?.errors || { '': ['Registration failed.'] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sign up</h1>
        <p className="mt-2 text-gray-500">
          <Link to="/login" className="text-primary hover:underline">
            Have an account?
          </Link>
        </p>
      </div>

      <ErrorList errors={errors} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 text-base">
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
}
