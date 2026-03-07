import React, { useContext, useState } from "react";
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
            reviewer_image: user?.photoURL || "https://i.ibb.co/3N1sTkn/user.png",
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
        <div className="app-container py-10">
            <div className="mx-auto max-w-3xl card p-6 sm:p-8">
                <h2 className="section-heading text-center">Add a New Review</h2>
                <p className="mt-1 text-center text-sm text-muted">Share what you tasted and help the community.</p>

                <form onSubmit={handleAddReview} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input name="food_name" placeholder="Food Name" />
                        <Input name="food_image" placeholder="Food Image URL" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input name="restaurant_name" placeholder="Restaurant Name" />
                        <Input name="location" placeholder="Location" />
                    </div>

                    <Input
                        name="rating"
                        type="number"
                        placeholder="Rating (1 - 5)"
                        min="1"
                        max="5"
                        step="0.1"
                    />

                    <textarea
                        name="review_text"
                        rows="6"
                        required
                        placeholder="Write your honest review"
                        className="input-field border-slate-300 bg-white dark:border-slate-500 dark:bg-slate-900"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Submitting..." : "Add Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Input({ type = "text", ...props }) {
    return (
        <input
            type={type}
            required
            className="input-field border-slate-300 bg-white dark:border-slate-500 dark:bg-slate-900"
            {...props}
        />
    );
}
