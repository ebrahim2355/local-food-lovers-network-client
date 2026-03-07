import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function Register() {
    const { createUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const handleRegister = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const photo = e.target.photo.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;

        if (!/(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(password)) {
            return toast.error("Password must contain uppercase, lowercase and 6+ characters");
        }

        if (password !== confirm) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        createUser(email, password)
            .then(() => {
                updateUserProfile(name, photo)
                    .then(async () => {
                        toast.success("Registration successful");

                        const newUser = {
                            name,
                            email,
                            photo,
                            role: "user",
                            createdAt: new Date(),
                        };

                        try {
                            await axiosSecure.post("/users", newUser);
                        } catch (err) {
                            console.error(err);
                            toast.error("Failed to save user to database");
                        }

                        setTimeout(() => {
                            navigate("/");
                        }, 1200);
                    })
                    .catch((err) => toast.error(err.message));
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            const newUser = {
                name: user?.displayName || "No Name",
                email: user?.email,
                photo: user?.photoURL,
                role: "user",
                createdAt: new Date(),
            };

            await axiosSecure.post("/users", newUser);
            toast.success("Signed up with Google");

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="app-container flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
            <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
                <div className="page-hero hidden p-8 md:block">
                    <p className="w-fit rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                        Join the network
                    </p>
                    <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                        Create your account and start reviewing local food.
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                        Share your favorite dishes, follow trusted reviewers, and build your own food journal.
                    </p>
                </div>

                <div className="card w-full p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h2>
                    <p className="mt-1 text-sm text-muted">It takes less than a minute.</p>

                    <form onSubmit={handleRegister} className="mt-6 space-y-4">
                        <input type="text" name="name" placeholder="Full Name" required className="input-field" />
                        <input type="text" name="photo" placeholder="Photo URL" className="input-field" />
                        <input type="email" name="email" placeholder="Email" required className="input-field" />

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
                                className="absolute right-3 top-3 text-slate-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm"
                                placeholder="Confirm Password"
                                required
                                className="input-field pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-slate-500"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </button>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <div className="my-5 text-center text-sm text-muted">or continue with</div>

                    <button
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white p-3 font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <FcGoogle className="text-xl" /> Continue with Google
                    </button>

                    <p className="mt-6 text-center text-sm text-muted">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
