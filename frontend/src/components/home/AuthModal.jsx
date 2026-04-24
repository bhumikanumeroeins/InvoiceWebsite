import { useState } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { authAPI, setAuthData } from '../../services/authService';

const AuthModal = ({ onClose, onSuccess, reason }) => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const response = await authAPI.login(formData);
        setAuthData(response.token, { email: response.email, userId: response.userId });
        toast.success('Welcome back!');
        onSuccess({ token: response.token, email: response.email });
      } else {
        await authAPI.register(formData);
        // auto sign in after register
        const response = await authAPI.login(formData);
        setAuthData(response.token, { email: response.email, userId: response.userId });
        toast.success('Account created!');
        onSuccess({ token: response.token, email: response.email });
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">InvoicePro</span>
        </div>

        {/* Reason banner */}
        {reason && (
          <div className="mb-5 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-700">
            {reason}
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {mode === 'signin'
            ? 'Your generated invoice will appear instantly after signing in.'
            : 'Free account — your invoice is saved automatically.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
            ) : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-indigo-600 font-medium hover:underline"
          >
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
