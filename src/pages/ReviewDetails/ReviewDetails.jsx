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

    if (loading) {
        return (
            <div className="app-container animate-pulse py-8">
                <div className="mb-6 h-5 w-40 rounded bg-gray-200" />
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-72 w-full bg-gray-200 dark:bg-slate-700" />
                    <div className="space-y-4 p-8">
                        <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
                        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
                        <div className="h-24 w-full rounded bg-gray-200 dark:bg-slate-700" />
                    </div>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="app-container flex min-h-[60vh] items-center justify-center text-muted">
                Review not found.
            </div>
        );
    }

    const stars = Array.from({ length: 5 }, (_, i) =>
        i < Math.round(review.rating) ? (
            <FaStar key={i} className="text-amber-400" />
        ) : (
            <FaRegStar key={i} className="text-slate-300 dark:text-slate-600" />
        )
    );

    return (
        <div className="app-container py-8">
            <button onClick={() => navigate(-1)} className="mb-5 text-sm font-semibold text-orange-500 hover:text-orange-600">
                Back to Reviews
            </button>

            <div className="card overflow-hidden">
                <img
                    src={review.food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={review.food_name}
                    className="h-72 w-full object-cover sm:h-96"
                />

                <div className="p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{review.food_name}</h1>
                    <p className="mt-2 text-sm text-muted">
                        {review.restaurant_name} - {review.location}
                    </p>

                    <div className="mb-6 mt-3 flex items-center gap-1">
                        {stars}
                        <span className="ml-2 text-sm text-muted">({review.rating})</span>
                    </div>

                    <p className="leading-relaxed text-slate-700 dark:text-slate-200">{review.review_text}</p>

                    <div className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-5 dark:border-slate-700">
                        <img
                            src={review.reviewer_image || "https://i.ibb.co/3N1sTkn/user.png"}
                            alt={review.reviewer_name}
                            className="h-12 w-12 rounded-full border object-cover"
                        />
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{review.reviewer_name}</p>
                            <p className="text-sm text-muted">{review.reviewer_email}</p>
                        </div>
                        <p className="ml-auto text-sm text-muted">{new Date(review.date).toLocaleDateString("en-GB")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
