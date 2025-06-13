import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { setUserInfo, syncCartToBackend } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://e-commerce-0ong.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      // ✅ Save user directly from register response
      setUserInfo({ ...data.user, token: data.token });

      // ✅ Sync cart after setting user info
      await syncCartToBackend();

      toast.success('Registration successful! Redirecting...', { autoClose: 2000 });
      setTimeout(() => navigate('/'), 2500);

    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">Sign Up</h2>

        {['name', 'email', 'password', 'confirmPassword'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold capitalize">
              {field === 'confirmPassword' ? 'Confirm Password' : field}
            </label>
            <input
              type={field.includes('password') ? 'password' : field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors[field] ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
              }`}
              placeholder={`Enter your ${field === 'confirmPassword' ? 'password again' : field}`}
            />
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg font-semibold shadow transition duration-200 ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Register;
