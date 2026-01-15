import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ReviewDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosSecure.get(`/reviews/${id}`);
                setReview(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load review details");
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id, axiosSecure]);

    /* ------------------ STATES ------------------ */

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-lg font-medium">
                Loading review details…
            </div>
        );
    }

    if (!review) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500">
                Review not found.
            </div>
        );
    }

    /* ------------------ STARS ------------------ */

    const stars = Array.from({ length: 5 }, (_, i) =>
        i < Math.round(review.rating) ? (
            <FaStar key={i} className="text-yellow-400" />
        ) : (
            <FaRegStar key={i} className="text-gray-400" />
        )
    );

    /* ------------------ UI ------------------ */

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-primary font-semibold hover:underline"
            >
                ← Back to Reviews
            </button>

            {/* Card */}
            <div className="card overflow-hidden">
                {/* Image */}
                <img
                    src={review.food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={review.food_name}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />

                {/* Content */}
                <div className="p-5 sm:p-8">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                        {review.food_name}
                    </h1>

                    {/* Meta */}
                    <p className="text-sm opacity-80 mb-3">
                        {review.restaurant_name} • {review.location}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-5">
                        {stars}
                        <span className="ml-2 text-sm opacity-70">
                            ({review.rating})
                        </span>
                    </div>

                    {/* Review Text */}
                    <p className="leading-relaxed mb-8">
                        {review.review_text}
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-5">
                        <img
                            src={review.reviewer_image || "https://i.ibb.co/3N1sTkn/user.png"}
                            alt={review.reviewer_name}
                            className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                            <p className="font-semibold">
                                {review.reviewer_name}
                            </p>
                            <p className="text-sm opacity-70">
                                {review.reviewer_email}
                            </p>
                        </div>
                        <p className="ml-auto text-sm opacity-60">
                            {new Date(review.date).toLocaleDateString("en-GB")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
