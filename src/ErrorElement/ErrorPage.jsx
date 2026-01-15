import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-[rgb(var(--color-bg))]">

            {/* Image */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6 max-w-lg w-full"
            >
                <img
                    src="https://images.unsplash.com/photo-1633078654544-61b3455b9161?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1045"
                    alt="404 Not Found"
                    className="w-full rounded-card shadow-lg"
                />
            </motion.div>

            {/* Title */}
            <motion.h1
                className="text-4xl sm:text-5xl font-bold text-primary mb-3"
                initial={{ scale: 0.85 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
            >
                Oops!
            </motion.h1>

            {/* Description */}
            <motion.p
                className="text-base sm:text-lg opacity-80 mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                The page you are looking for doesn’t exist or may have been moved.
            </motion.p>

            {/* CTA */}
            <motion.button
                onClick={() => navigate("/")}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Back to Home
            </motion.button>
        </div>
    );
}
