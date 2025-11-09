import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function AddReview() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleAddReview = async (e) => {
        e.preventDefault();
        const form = e.target;

        const newReview = {
            food_name: form.food_name.value,
            food_image: form.food_image.value,
            restaurant_name: form.restaurant_name.value,
            location: form.location.value,
            rating: parseFloat(form.rating.value),
            review_text: form.review_text.value,
            reviewer_name: user?.displayName || "Anonymous User",
            reviewer_email: user?.email,
            reviewer_image: user?.photoURL || "https://i.ibb.co/3N1sTkn/user.png",
            date: new Date(),
            favorites: form.favorites.checked,
        };

        try {
            setLoading(true);
            const res = await axiosSecure.post("/reviews", newReview);
            if (res.data?.insertedId || res.data?.acknowledged) {
                toast.success("Review added successfully!");
                form.reset();
                setTimeout(() => navigate("/all-reviews"), 1200);
            } else {
                toast.error("Failed to add review");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while adding review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-6">
                    Add a New Review
                </h2>

                <form
                    onSubmit={handleAddReview}
                    className="flex flex-col gap-5 sm:gap-6"
                >
                    {/* Food Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <input
                            type="text"
                            name="food_name"
                            placeholder="Food Name"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        />
                        <input
                            type="text"
                            name="food_image"
                            placeholder="Food Image URL"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        />
                    </div>

                    {/* Restaurant Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <input
                            type="text"
                            name="restaurant_name"
                            placeholder="Restaurant Name"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        />
                    </div>

                    {/* Rating & Review */}
                    <div className="flex flex-col gap-4">
                        <input
                            type="number"
                            name="rating"
                            placeholder="Rating (1 - 5)"
                            min="1"
                            max="5"
                            step="0.1"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        />
                        <textarea
                            name="review_text"
                            placeholder="Write your review..."
                            rows="5"
                            required
                            className="w-full p-3 border rounded-lg focus:outline-orange-500"
                        ></textarea>

                        <label className="flex items-center gap-2 text-gray-700 text-sm">
                            <input
                                type="checkbox"
                                name="favorites"
                                className="accent-orange-500"
                            />
                            Mark as Favorite ❤️
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-base sm:text-lg"
                    >
                        {loading ? "Submitting..." : "Add Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
