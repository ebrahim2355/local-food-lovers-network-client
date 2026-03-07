import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-slate-800">
            <div className="app-container grid grid-cols-1 gap-10 py-12 md:grid-cols-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Local Food <span className="text-orange-400">Lovers</span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        A community where food enthusiasts discover hidden gems, share honest
                        reviews, and help others find unforgettable local flavors.
                    </p>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-200">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
                        <li><Link to="/all-reviews" className="hover:text-orange-400">All Reviews</Link></li>
                        <li><Link to="/add-review" className="hover:text-orange-400">Add Review</Link></li>
                        <li><Link to="/my-favorites" className="hover:text-orange-400">My Favorites</Link></li>
                        <li><Link to="/my-reviews" className="hover:text-orange-400">My Reviews</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-200">
                        Follow
                    </h3>
                    <div className="flex items-center gap-3 text-lg">
                        <a href="https://facebook.com/ebrahim2355" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-orange-400 hover:text-orange-400">
                            <FaFacebookF />
                        </a>
                        <a href="https://x.com/ebrahim2355" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-orange-400 hover:text-orange-400">
                            <FaXTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-orange-400 hover:text-orange-400">
                            <FaInstagram />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-orange-400 hover:text-orange-400">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
                Copyright {new Date().getFullYear()} Local Food Lovers Network. All rights reserved.
            </div>
        </footer>
    );
}
