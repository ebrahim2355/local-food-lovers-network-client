import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";

export default function AllReviews() {
    const axiosSecure = useAxiosSecure();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 6;

    const fetchReviews = async (searchTerm = "", page = 1) => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(
                `/reviews?search=${searchTerm}&page=${page}&limit=${limit}`
            );

            setReviews(res.data.reviews);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.page);
            setActiveSearch(searchTerm);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews("", 1);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews(search.trim(), 1);
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                All Reviews
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex justify-center mb-8">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by food name..."
                    className="w-full sm:w-1/2 p-3 border rounded-l-lg 
                        focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-r-lg font-medium"
                >
                    Search
                </button>
            </form>

            {/* Skeleton Loader */}
            {loading && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card p-4 animate-pulse">
                            <div className="h-48 rounded-lg bg-gray-200 dark:bg-neutral-700 mb-4" />
                            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-700 mb-2" />
                            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-neutral-700 mb-4" />
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-700" />
                                <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-neutral-700" />
                            </div>
                            <div className="h-9 w-full rounded bg-gray-200 dark:bg-neutral-700 mt-5" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && reviews?.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No reviews found.
                </p>
            )}

            {!loading && reviews?.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <SingleReviewCard key={review._id} review={review} />
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => fetchReviews(activeSearch, currentPage - 1)}
                        className="px-4 py-2 rounded border disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => fetchReviews(activeSearch, page)}
                                className={`px-4 py-2 rounded border ${currentPage === page
                                        ? "bg-orange-500 text-white"
                                        : "hover:bg-gray-100 dark:hover:bg-neutral-700"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchReviews(activeSearch, currentPage + 1)}
                        className="px-4 py-2 rounded border disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
