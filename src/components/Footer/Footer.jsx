import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold text-orange-500 mb-3">
                        🍴 Local Food Lovers
                    </h2>
                    <p className="text-sm leading-relaxed">
                        A community for food enthusiasts to share local flavors, honest reviews,
                        and culinary adventures from all over Bangladesh.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
                        <li><Link to="/all-reviews" className="hover:text-orange-500">All Reviews</Link></li>
                        <li><Link to="/add-review" className="hover:text-orange-500">Add Review</Link></li>
                        <li><Link to="/my-favorites" className="hover:text-orange-500">My Favorites</Link></li>
                        <li><Link to="/about" className="hover:text-orange-500">About</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
                    <div className="flex items-center gap-4 text-xl">
                        <a href="https://facebook.com/ebrahim2355" target="_blank" rel="noreferrer" className="hover:text-orange-500">
                            <FaFacebookF />
                        </a>
                        <a href="https://x.com/ebrahim2355" target="_blank" rel="noreferrer" className="hover:text-orange-500">
                            <FaXTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-orange-500">
                            <FaInstagram />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-orange-500">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
                © {new Date().getFullYear()} Local Food Lovers Network — All Rights Reserved.
            </div>
        </footer>
    );
}
