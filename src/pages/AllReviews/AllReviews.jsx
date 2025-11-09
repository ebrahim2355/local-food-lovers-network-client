import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";

export default function AllReviews() {
    const axiosSecure = useAxiosSecure();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchReviews = async (searchTerm = "") => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/reviews${searchTerm ? `?search=${searchTerm}` : ""}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews(search);
    };

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

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex justify-center mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by food name..."
                    className="w-full sm:w-1/2 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-lg font-medium cursor-pointer"
                >
                    Search
                </button>
            </form>

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
