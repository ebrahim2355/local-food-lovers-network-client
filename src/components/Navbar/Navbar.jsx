import React, { useContext, useState } from "react";
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

    const handleLogout = () => {
        logOut().catch(console.error);
    };

    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 rounded-md transition font-medium
     ${isActive ? "text-primary" : "hover:text-primary"}`;

    return (
        <nav className="sticky top-0 z-50 bg-[rgb(var(--color-surface))] dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl sm:text-2xl font-bold text-primary">
                    🍴 Local Food Lovers
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-4">
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

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <FiSun title="Switch to Light Mode" /> : <FiMoon title="Switch to Dark Mode"/>}
                    </button>

                    {/* Auth Section */}
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="px-3 py-2 font-medium hover:text-primary"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <img
                                src={user.photoURL || "https://i.ibb.co/Z8t0mMC/user1.jpg"}
                                alt="User"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
                            />

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 card p-2">
                                    <Link
                                        to="/add-review"
                                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FaPlusCircle /> Add Review
                                    </Link>
                                    <Link
                                        to="/my-reviews"
                                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FaUser /> My Reviews
                                    </Link>
                                    <Link
                                        to="/my-favorites"
                                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FaHeart /> My Favorites
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[rgb(var(--color-surface))] border-t border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-col items-center gap-3 py-4">
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
                    </ul>
                </div>
            )}
        </nav>
    );
}
