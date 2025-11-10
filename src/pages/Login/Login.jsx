import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";
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

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setLoading(true);
        signIn(email, password)
            .then(() => {
                toast.success("Login successful!");
                navigate(from, { replace: true });
            })
            .catch((err) => toast.error("Email Address or Password is Invalid"))
            .finally(() => setLoading(false));
    };

    const handleGoogleLogin = async () => {
        try{
            const result = await googleSignIn();
            const user = result.user;

            const newUser = {
                name: user.displayName || "No Name",
                email: user.email,
                photo: user.photoURL || "",
                role: "user",
                createdAt: new Date(),
            }

            try{
                const res = await axiosSecure.post("/users", newUser);
                if(res.data.message){
                    // toast("User already exists in Database")
                }
                else{
                    toast.success("Signed in with Google!");
                }
            }
            catch(err){
                console.error(err);
                // toast.error("Failed to save Google user to database");
            }

            navigate(from, {replace: true});
        }
        catch(err){
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div><Toaster/></div>
            <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">Welcome Back!</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full p-3 border rounded-lg focus:outline-orange-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500 pr-10"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">or</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                    <FcGoogle className="text-xl" /> Continue with Google
                </button>

                <p className="text-center text-sm mt-5 text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-orange-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
