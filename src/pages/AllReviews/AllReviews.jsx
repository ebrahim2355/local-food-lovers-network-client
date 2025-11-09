import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";


export default function AllReviews() {
    const axiosSecure = useAxiosSecure();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosSecure.get("/reviews");
                console.log(res.data)
                setReviews(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [axiosSecure]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-xl text-orange-600">
                Loading reviews...
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                All Reviews
            </h1>

            {reviews.length === 0 ? (
                <p className="text-center text-gray-500">No reviews found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <SingleReviewCard key={review._id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}
