import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function MyFavorites() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const [favRes, reviewsRes] = await Promise.all([
                    axiosSecure.get(`/favorites/${user.email}`),
                    axiosSecure.get("/reviews"),
                ]);

                const favData = favRes.data || [];
                const reviews = reviewsRes.data?.reviews || [];
                const reviewMap = reviews.reduce((acc, review) => {
                    acc[review._id] = review;
                    return acc;
                }, {});

                const detailedFavorites = favData
                    .map((fav) => ({ ...fav, review: reviewMap[fav.review_id] }))
                    .filter((fav) => Boolean(fav.review));

                setFavorites(detailedFavorites);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchFavorites();
    }, [user, axiosSecure]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Remove from favorites?",
            text: "This item will be removed from your favorites list.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, remove",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/favorites/${id}`);
                    setFavorites((prev) => prev.filter((f) => f._id !== id));
                    toast.success("Removed from favorites");
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to remove favorite");
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="app-container py-10">
                <div className="mb-6 h-8 w-48 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />
                    ))}
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="app-container py-16 text-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">No favorites yet</h2>
                <p className="mt-2 text-sm text-muted">Start adding reviews you love.</p>
            </div>
        );
    }

    return (
        <div className="app-container py-8">
            <div className="mb-6">
                <h2 className="section-heading">My Favorites</h2>
                <p className="mt-1 text-sm text-muted">Your saved reviews, ready to revisit anytime.</p>
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                        <tr>
                            <th className="p-4 text-left">Food</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Restaurant</th>
                            <th className="p-4 text-left">Added On</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favorites.map((fav) => (
                            <tr key={fav._id} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                                <td className="p-4">
                                    <img
                                        src={fav.review?.food_image}
                                        alt={fav.review?.food_name}
                                        className="h-14 w-14 rounded-lg object-cover"
                                    />
                                </td>
                                <td className="p-4 font-medium">{fav.review?.food_name}</td>
                                <td className="p-4">{fav.review?.restaurant_name}</td>
                                <td className="p-4">{new Date(fav.addedAt).toLocaleDateString()}</td>
                                <td className="space-x-2 p-4">
                                    <button onClick={() => navigate(`/review/${fav.review_id}`)} className="btn-outline py-1.5 text-xs">
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fav._id)}
                                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid gap-4 md:hidden">
                {favorites.map((fav) => (
                    <div key={fav._id} className="card p-4">
                        <button onClick={() => navigate(`/review/${fav.review_id}`)} className="flex w-full items-center gap-4 text-left">
                            <img
                                src={fav.review?.food_image}
                                alt={fav.review?.food_name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{fav.review?.food_name}</h3>
                                <p className="text-sm text-muted">{fav.review?.restaurant_name}</p>
                                <p className="text-xs text-muted">{new Date(fav.addedAt).toLocaleDateString()}</p>
                            </div>
                        </button>

                        {fav.review?.review_text && (
                            <p className="mt-3 line-clamp-3 text-sm text-muted">{fav.review.review_text}</p>
                        )}

                        <button
                            onClick={() => handleDelete(fav._id)}
                            className="mt-4 w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                            Remove Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
