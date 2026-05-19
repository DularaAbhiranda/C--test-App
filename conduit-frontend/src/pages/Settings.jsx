import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import agent from '../api/agent';
import ErrorList from '../components/ErrorList';

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    image: currentUser?.image || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(false);
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      const { user } = await agent.Auth.save(payload);
      updateUser(user);
      setSuccess(true);
    } catch (err) {
      setErrors(err.response?.data?.errors || { '': ['Update failed.'] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Your Settings</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
          Settings updated successfully!
        </div>
      )}

      <ErrorList errors={errors} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="image"
          type="url"
          placeholder="URL of profile picture"
          value={form.image}
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="input-field"
        />
        <textarea
          name="bio"
          placeholder="Short bio about you"
          value={form.bio}
          onChange={handleChange}
          rows={5}
          className="input-field resize-none"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="password"
          type="password"
          placeholder="New Password (leave blank to keep current)"
          value={form.password}
          onChange={handleChange}
          className="input-field"
        />
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 text-base">
            {submitting ? 'Saving...' : 'Update Settings'}
          </button>
        </div>
      </form>

      <hr className="my-8" />

      <button onClick={handleLogout} className="btn-outline-danger">
        Or click here to logout.
      </button>
    </div>
  );
}
