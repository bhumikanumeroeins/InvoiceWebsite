import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FileText } from 'lucide-react';

const SignUp = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Sign up:', formData);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-4">
            {/* Decorative Gradient Circles */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-emerald-100 opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 opacity-50 blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-slate-900">InvoicePro</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
                    <p className="text-slate-600">Get started with professional invoicing</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-slate-200" />
                        <span className="px-4 text-sm text-slate-500">or continue with</span>
                        <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <FcGoogle className="w-5 h-5" />
                            <span className="text-sm font-medium text-slate-700">Google</span>
                        </button>

                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <FaGithub className="w-5 h-5" />
                            <span className="text-sm font-medium text-slate-700">GitHub</span>
                        </button>
                    </div>
                </div>

                <p className="text-center mt-6 text-slate-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
