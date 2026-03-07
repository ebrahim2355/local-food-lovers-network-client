import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import {
    FaBars,
    FaTimes,
    FaHeart,
    FaPlusCircle,
    FaSignOutAlt,
    FaUser,
} from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext) || {};
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleLogout = () => {
        logOut().catch(console.error);
    };

    const navLinkClass = ({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
            isActive
                ? "bg-orange-500/15 text-orange-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
        }`;

    const dropdownLinkClass = ({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-orange-100 text-orange-600 dark:bg-slate-800 dark:text-orange-400"
                : "text-slate-700 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-orange-400"
        }`;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75">
            <div className="app-container flex items-center justify-between py-3">
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Local Food <span className="text-orange-500">Lovers</span>
                </Link>

                <ul className="hidden md:flex items-center gap-2">
                    <li>
                        <NavLink to="/" className={navLinkClass}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/all-reviews" className={navLinkClass}>
                            All Reviews
                        </NavLink>
                    </li>
                </ul>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <FiSun title="Switch to Light Mode" /> : <FiMoon title="Switch to Dark Mode" />}
                    </button>

                    {!user ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                to="/login"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary text-sm">
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="cursor-pointer rounded-full border-2 border-orange-500 p-0.5"
                            >
                                <img
                                    src={user.photoURL || "https://i.ibb.co/Z8t0mMC/user1.jpg"}
                                    alt="User"
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-orange-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
                                    <div className="mb-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                                        Account Menu
                                    </div>
                                    <NavLink
                                        to="/add-review"
                                        onClick={() => setDropdownOpen(false)}
                                        className={dropdownLinkClass}
                                    >
                                        <FaPlusCircle /> Add Review
                                    </NavLink>
                                    <NavLink
                                        to="/my-reviews"
                                        onClick={() => setDropdownOpen(false)}
                                        className={dropdownLinkClass}
                                    >
                                        <FaUser /> My Reviews
                                    </NavLink>
                                    <NavLink
                                        to="/my-favorites"
                                        onClick={() => setDropdownOpen(false)}
                                        className={dropdownLinkClass}
                                    >
                                        <FaHeart /> My Favorites
                                    </NavLink>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-xl border border-slate-200 p-2 md:hidden dark:border-slate-700"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-200 bg-white/95 md:hidden dark:border-slate-800 dark:bg-slate-950">
                    <ul className="app-container flex flex-col gap-2 py-4">
                        <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink
                            to="/all-reviews"
                            className={navLinkClass}
                            onClick={() => setMenuOpen(false)}
                        >
                            All Reviews
                        </NavLink>
                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-fit text-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
