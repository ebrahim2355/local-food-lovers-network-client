import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function ErrorPage() {
    const navigate = useNavigate();
    const Motion = motion;

    return (
        <div className="app-container flex min-h-[70vh] flex-col items-center justify-center py-8 text-center">
            <Motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-2xl"
            >
                <img
                    src="https://images.unsplash.com/photo-1633078654544-61b3455b9161?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1045"
                    alt="404 Not Found"
                    className="h-72 w-full rounded-3xl border border-slate-200 object-cover shadow-xl dark:border-slate-800"
                />
            </Motion.div>

            <Motion.h1
                className="mt-7 text-5xl font-bold text-orange-500"
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
            >
                404
            </Motion.h1>

            <Motion.p
                className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                The page you are looking for does not exist or may have been moved.
            </Motion.p>

            <Motion.button
                onClick={() => navigate("/")}
                className="btn-primary mt-7"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
            >
                Back to Home
            </Motion.button>
        </div>
    );
}
