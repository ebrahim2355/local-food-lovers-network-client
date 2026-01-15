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
                const favRes = await axiosSecure.get(`/favorites/${user.email}`);
                const favData = favRes.data;

                const detailedFavorites = await Promise.all(
                    favData.map(async (fav) => {
                        const reviewRes = await axiosSecure.get(`/reviews/${fav.review_id}`);
                        return { ...fav, review: reviewRes.data };
                    })
                );

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
            cancelButtonColor: "#6b7280",
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
            <div className="min-h-screen max-w-6xl mx-auto p-4 pt-10 pb-20">
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
                    My Reviews
                </h2>

                {/* Desktop Skeleton */}
                <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                    <table className="table w-full">
                        <thead className="dark:bg-gray-500">
                            <tr>
                                <th>Food Image</th>
                                <th>Food Name</th>
                                <th>Restaurant</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td>
                                        <div className="w-16 h-16 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-28 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-16 bg-gray-200 rounded" />
                                            <div className="h-8 w-16 bg-gray-200 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Skeleton */}
                <div className="md:hidden flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="flex gap-4 p-4 items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="p-4 gap-2">
                                <div className="h-8 w-full bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-gray-500">
                    Start adding reviews you love ❤️
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 pt-10 pb-20">
            <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
                My Favorites
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl shadow">
                <table className="w-full text-sm">
                    <thead className=" dark:bg-gray-500">
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
                            <tr
                                key={fav._id}
                                className="border-t dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                            >
                                <td className="p-4">
                                    <img
                                        src={fav.review?.food_image}
                                        alt={fav.review?.food_name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                </td>
                                <td className="p-4 font-medium">
                                    {fav.review?.food_name}
                                </td>
                                <td className="p-4">
                                    {fav.review?.restaurant_name}
                                </td>
                                <td className="p-4">
                                    {new Date(fav.addedAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() => navigate(`/review/${fav.
                                            review_id}`)}
                                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 cursor-pointer"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fav._id)}
                                        className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
                {favorites.map((fav) => (
                    <div key={fav._id} className="card p-4">
                        <div onClick={() => navigate(`/review/${fav.
                            review_id}`)} className="flex gap-4 items-center">
                            <img
                                src={fav.review?.food_image}
                                alt={fav.review?.food_name}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                    {fav.review?.food_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {fav.review?.restaurant_name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(fav.addedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {fav.review?.review_text && (
                            <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                                {fav.review.review_text}
                            </p>
                        )}

                        <button
                            onClick={() => handleDelete(fav._id)}
                            className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                            Remove Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
