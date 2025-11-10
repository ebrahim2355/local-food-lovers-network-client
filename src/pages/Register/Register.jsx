import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";
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

        if (!/(?=.*[A-Z])(?=.*[a-z]).{6,}/.test(password))
            return toast.error("Password must contain uppercase, lowercase & 6+ characters!");
        if (password !== confirm) return toast.error("Passwords do not match!");

        setLoading(true);
        createUser(email, password)
            .then(() => {
                updateUserProfile(name, photo)
                    .then(async () => {
                        toast.success("Registration successful!");

                        const newUser = {
                            name,
                            email,
                            photo,
                            role: "user",
                            createdAt: new Date(),
                        }
                        try{
                            const res = await axiosSecure.post("/users", newUser);
                            if(res.data.message){
                                toast("User already exists in Database")
                            }
                        }
                        catch(err){
                            console.error(err);
                            toast.error("Failed to save user to database");
                        }

                        setTimeout(() => {navigate("/")}, 1500);
                    })
                    .catch((err) => toast.error(err.message));
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    };

    const handleGoogleLogin = async () => {
        try{
            const result = await googleSignIn();
            const user = result.user;
            console.log(result.user)

            const newUser = {
                name: user?.displayName || "No Name",
                email: user?.email,
                photo: user?.photoURL,
                role: "user",
                createdAt: new Date(),
            }

            try{
                const res = await axiosSecure.post("/users", newUser);
                if(res.data.message){
                    // toast("User already exists in Database")
                }
                else{
                    toast.success("Signed up with Google!");
                }
            }
            catch(err){
                console.error(err);
                // toast.error("Failed to save Google user to database");
            }

            setTimeout(() => {navigate("/")}, 1500);
        }
        catch(err){
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div><Toaster /></div>
            <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">Create an Account</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" required className="w-full p-3 border rounded-lg focus:outline-orange-500" />
                    <input type="text" name="photo" placeholder="Photo URL" className="w-full p-3 border rounded-lg focus:outline-orange-500" />
                    <input type="email" name="email" placeholder="Email" required className="w-full p-3 border rounded-lg focus:outline-orange-500" />

                    {/* Password Field */}
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

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm"
                            placeholder="Confirm Password"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500 pr-10"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
                    >
                        {loading ? "Registering..." : "Register"}
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
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
