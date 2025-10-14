import type { Route } from "./+types/login";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth";
import { DEMO_MODE } from "../api";
import { motion } from "framer-motion";
import { UserIcon, LockClosedIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Login - Camera Video Downloader" }];
}

export default function LoginRoute() {
    const { login, isLoading, user } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        }
    }

    useEffect(() => {
        if (!isLoading && user) {
            navigate("/", { replace: true });
        }
    }, [isLoading, user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Header Section */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-200 mb-4">
                        <VideoCameraIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        Camera Video Downloader
                    </h1>
                    <p className="text-gray-600">Access your security footage</p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
                        <p className="text-sm text-gray-600">Please sign in to your account</p>
                    </div>

                    <div className="space-y-5">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                                Username
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-800"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-800"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2"
                        >
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading || !username || !password}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>

                    {/* Help Text */}
                    {DEMO_MODE && (
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-center text-gray-500">
                                🔒 Demo mode: Enter any username and password to continue
                            </p>
                        </div>
                    )}
                </motion.form>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-gray-600 mt-6"
                >
                    Secure • Reliable • Fast
                </motion.p>
            </motion.div>
        </div>
    );
}
