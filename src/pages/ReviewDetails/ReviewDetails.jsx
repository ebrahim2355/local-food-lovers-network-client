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

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-xl text-orange-600">
                Loading review details...
            </div>
        );

    if (!review)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Review not found.
            </div>
        );

    // Create stars for rating
    const stars = Array.from({ length: 5 }, (_, i) =>
        i < Math.round(review.rating)
            ? <FaStar key={i} className="text-yellow-400" />
            : <FaRegStar key={i} className="text-gray-300" />
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-orange-500 font-semibold hover:underline cursor-pointer"
            >
                ← Back to All Reviews
            </button>

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <img
                    src={review.food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={review.food_name}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />

                <div className="p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{review.food_name}</h1>
                    <p className="text-gray-600 mb-3">
                        {review.restaurant_name} • {review.location}
                    </p>

                    <div className="flex items-center gap-2 mb-4">{stars}</div>

                    <p className="text-gray-700 mb-6">{review.review_text}</p>

                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                        <img
                            src={review.reviewer_image || "https://i.ibb.co/3N1sTkn/user.png"}
                            alt={review.reviewer_name}
                            className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{review.reviewer_name}</p>
                            <p className="text-gray-500 text-sm">{review.reviewer_email}</p>
                        </div>
                        <p className="ml-auto text-gray-400 text-sm">
                            {new Date(review.date).toLocaleDateString("en-GB")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
