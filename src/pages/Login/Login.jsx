import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Login() {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();

    const from =
        typeof location.state?.from === "string"
            ? location.state.from
            : location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            setLoading(true);
            await signIn(email, password);
            toast.success("Login successful");
            navigate(from, { replace: true });
        } catch {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            await axiosSecure.post("/users", {
                name: user.displayName || "No Name",
                email: user.email,
                photo: user.photoURL || "",
                role: "user",
                createdAt: new Date(),
            });

            toast.success("Signed in with Google");
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            toast.error("Google sign-in failed");
        }
    };

    return (
        <div className="app-container flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
                <div className="page-hero hidden p-8 md:block">
                    <p className="w-fit rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                        Welcome back
                    </p>
                    <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                        Login and keep sharing local food stories.
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                        Track your reviews, save favorites, and discover places recommended by real food lovers.
                    </p>
                </div>

                <div className="card w-full p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
                    <p className="mt-1 text-sm text-muted">Use your account to continue.</p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <input type="email" name="email" placeholder="Email address" required className="input-field" />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                required
                                className="input-field pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-500 dark:text-slate-400"
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </button>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="my-5 text-center text-sm text-muted">or continue with</div>

                    <button
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white p-3 font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-center text-sm text-muted">
                        Do not have an account?{" "}
                        <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
