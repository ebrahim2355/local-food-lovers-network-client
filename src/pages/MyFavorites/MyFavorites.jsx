import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MyFavorites() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // Step 1: get favorites (just review_id)
                const favRes = await axiosSecure.get(`/favorites/${user.email}`);
                const favData = favRes.data;

                // Step 2: fetch review details for each favorite
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
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, remove",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/favorites/${id}`);
                    setFavorites(favorites.filter((f) => f._id !== id));
                    toast.success("Removed from favorites!");
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to remove favorite");
                }
            }
        });
    };

    if (loading) return <p className="text-center py-10">Loading favorites...</p>;
    if (favorites.length === 0) return <p className="text-center py-10">No favorites yet.</p>;

    return (
        <div className="min-h-screen max-w-6xl mx-auto p-4 pt-10 pb-20">
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">My Favorites</h2>

            {/* Table for medium+ screens */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>Food Image</th>
                            <th>Food Name</th>
                            <th>Restaurant</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favorites.map((fav) => (
                            <tr key={fav._id} className="hover:bg-gray-50">
                                <td>
                                    <img
                                        src={fav.review?.food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                                        alt={fav.review?.food_name}
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                </td>
                                <td>{fav.review?.food_name}</td>
                                <td>{fav.review?.restaurant_name}</td>
                                <td>{new Date(fav.addedAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(fav._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card layout for small screens */}
            <div className="md:hidden flex flex-col gap-4">
                {favorites.map((fav) => (
                    <div key={fav._id} className="card">
                        <div className="flex gap-4 p-4 items-center">
                            <img
                                src={fav.review?.food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                                alt={fav.review?.food_name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{fav.review?.food_name}</h3>
                                <p className="text-sm text-gray-500">{fav.review?.restaurant_name}</p>
                                <p className="text-xs text-gray-400">{new Date(fav.addedAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(fav._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                        {fav.review?.review_text && (
                            <p className="m-4 text-sm line-clamp-3">{fav.review.review_text}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
