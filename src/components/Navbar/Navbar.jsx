import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { FaBars, FaTimes, FaHeart, FaPlusCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";


export default function Navbar() {
    const { user, logOut } = useContext(AuthContext) || {};
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logOut()
            .then(() => console.log("User logged out"))
            .catch((err) => console.error(err));
    };

    const navLinks = (
        <>
            <li><NavLink to="/" className="hover:text-orange-500">Home</NavLink></li>
            <li><NavLink to="/all-reviews" className="hover:text-orange-500">All Reviews</NavLink></li>
        </>
    );

    return (
        <nav className="bg-white shadow-md sticky w-full z-10 top-0 left-0">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

                <Link to="/" className="text-2xl font-bold text-orange-600">
                    🍴 Local Food Lovers
                </Link>

                <ul className="hidden md:flex gap-6 text-gray-700 font-medium">{navLinks}</ul>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="text-gray-700 font-medium hover:text-orange-600">Login</Link>
                            <Link to="/register" className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">Register</Link>
                        </>
                    ) : (
                        <div className="relative">
                            <img
                                src={user.photoURL || "https://i.ibb.co/Z8t0mMC/user1.jpg"}
                                alt="User"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 rounded-full cursor-pointer border-2 border-orange-500"
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg p-2">
                                    <Link to="/add-review" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"><FaPlusCircle /> Add Review</Link>
                                    <Link to="/my-reviews" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"><FaUser /> My Reviews</Link>
                                    <Link to="/my-favorites" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"><FaHeart /> My Favorites</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-2xl text-gray-700 cursor-pointer hover:outline hover:outline-gray-200 hover:bg-gray-100 hover:rounded-2xl p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <ul className="md:hidden bg-white border-t shadow-md flex flex-col items-center gap-4 py-4 text-gray-700 font-medium">
                    {navLinks}
                </ul>
            )}
        </nav>
    );
}
