import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
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
            reviewer_image:
                user?.photoURL || "https://i.ibb.co/3N1sTkn/user.png",
            date: new Date(),
        };

        try {
            setLoading(true);
            const res = await axiosSecure.post("/reviews", newReview);
            if (res.data?.insertedId) {
                toast.success("Review added successfully");
                form.reset();
                setTimeout(() => navigate("/all-reviews"), 1200);
            } else {
                toast.error("Failed to add review");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[rgb(var(--color-bg))]">
            <div className="card w-full max-w-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
                    Add a New Review
                </h2>

                <form onSubmit={handleAddReview} className="space-y-6">
                    {/* Food Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input name="food_name" placeholder="Food Name" />
                        <Input name="food_image" placeholder="Food Image URL" />
                    </div>

                    {/* Restaurant Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input name="restaurant_name" placeholder="Restaurant Name" />
                        <Input name="location" placeholder="Location" />
                    </div>

                    {/* Rating */}
                    <Input
                        name="rating"
                        type="number"
                        placeholder="Rating (1 – 5)"
                        min="1"
                        max="5"
                        step="0.1"
                    />

                    {/* Review */}
                    <textarea
                        name="review_text"
                        rows="5"
                        required
                        placeholder="Write your honest review..."
                        className="w-full p-3 rounded-lg border bg-transparent outline-none
              border-gray-300 dark:border-gray-600
              focus:ring-2 focus:ring-primary"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Add Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* Reusable Input */
function Input({ type = "text", ...props }) {
    return (
        <input
            type={type}
            required
            className="w-full p-3 rounded-lg border bg-transparent outline-none
        border-gray-300 dark:border-gray-600
        focus:ring-2 focus:ring-primary"
            {...props}
        />
    );
}
