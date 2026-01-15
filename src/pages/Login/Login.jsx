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

    const from = location.state?.from?.pathname || "/";

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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                        className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full p-3 rounded-lg border border-gray-500  focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 cursor-pointer"
                        >
                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 text-center text-muted">or</div>

                {/* Google */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-neutral-700 transition cursor-pointer"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium">Continue with Google</span>
                </button>

                {/* Footer */}
                <p className="text-center text-sm mt-6 text-muted">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-orange-500 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
