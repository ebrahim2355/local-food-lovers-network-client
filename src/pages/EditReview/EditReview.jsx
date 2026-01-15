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
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const res = await axiosSecure.put(`/reviews/${id}`, review);
            if (res.data.modifiedCount > 0) {
                toast.success("Review updated successfully");
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted">
                Loading review data...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[rgb(var(--color-bg))]">
            <div className="card w-full max-w-3xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
                    Edit Your Review
                </h2>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <Input
                        label="Food Name"
                        name="food_name"
                        value={review.food_name}
                        onChange={handleChange}
                    />

                    <Input
                        label="Food Image URL"
                        name="food_image"
                        value={review.food_image}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Restaurant Name"
                            name="restaurant_name"
                            value={review.restaurant_name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Location"
                            name="location"
                            value={review.location}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="Rating (1 – 5)"
                        name="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={review.rating}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block mb-1 text-sm font-medium text-muted">
                            Review Description
                        </label>
                        <textarea
                            name="review_text"
                            value={review.review_text}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="w-full p-3 rounded-lg border bg-transparent outline-none
                border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {updating ? "Updating..." : "Update Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* Reusable Input */
function Input({ label, type = "text", ...props }) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-muted">
                {label}
            </label>
            <input
                type={type}
                required
                className="w-full p-3 rounded-lg border bg-transparent outline-none
          border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-primary"
                {...props}
            />
        </div>
    );
}
