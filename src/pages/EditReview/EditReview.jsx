import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function EditReview() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [review, setReview] = useState({
        food_name: "",
        food_image: "",
        restaurant_name: "",
        location: "",
        rating: "",
        review_text: "",
        favorites: false,
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Fetch existing review data
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosSecure.get(`/reviews/${id}`);
                setReview(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load review data");
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id, axiosSecure]);

    // Handle input changes (controlled form)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReview((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle update
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            const res = await axiosSecure.put(`/reviews/${id}`, review);

            if (res.data.modifiedCount > 0) {
                toast.success("Review updated successfully!");
                setTimeout(() => navigate("/my-reviews"), 1500);
            } else {
                toast.error("No changes made");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update review");
        } finally {
            setUpdating(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500">
                Loading review data...
            </div>
        );

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 py-10 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-6">
                    Edit Your Review
                </h2>

                <form onSubmit={handleUpdate} className="space-y-5">
                    {/* Food Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Food Name
                        </label>
                        <input
                            type="text"
                            name="food_name"
                            value={review.food_name}
                            onChange={handleChange}
                            required
                            placeholder="Food name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Food Image */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Food Image URL
                        </label>
                        <input
                            type="text"
                            name="food_image"
                            value={review.food_image}
                            onChange={handleChange}
                            required
                            placeholder="Image URL"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Restaurant and Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                name="restaurant_name"
                                value={review.restaurant_name}
                                onChange={handleChange}
                                required
                                placeholder="Restaurant name"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={review.location}
                                onChange={handleChange}
                                required
                                placeholder="Location"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Rating (1–5)
                        </label>
                        <input
                            type="number"
                            name="rating"
                            value={review.rating}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            step="0.1"
                            required
                            placeholder="Enter rating"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Review Description
                        </label>
                        <textarea
                            name="review_text"
                            value={review.review_text}
                            onChange={handleChange}
                            rows="5"
                            required
                            placeholder="Write your review..."
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                    </div>

                    {/* Favorite */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="favorites"
                            checked={review.favorites || false}
                            onChange={handleChange}
                            className="accent-orange-500 w-5 h-5"
                        />
                        <label className="text-gray-700">Mark as Favorite ❤️</label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
                    >
                        {updating ? "Updating..." : "Update Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
