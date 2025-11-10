import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
            <motion.img
                src="https://images.unsplash.com/photo-1633078654544-61b3455b9161?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1045"
                alt="404 Not Found"
                className="w-full max-w-lg mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            />

            <motion.h1
                className="text-5xl font-bold text-orange-500 mb-3"
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                Oops!
            </motion.h1>

            <motion.p
                className="text-gray-700 text-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                The page you are looking for does not exist.
            </motion.p>

            <motion.button
                onClick={() => navigate("/")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Back to Home
            </motion.button>
        </div>
    );
}
