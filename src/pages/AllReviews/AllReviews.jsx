import React, { useCallback, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";
import useAuth from "../../hooks/useAuth";

export default function AllReviews() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favoriteMap, setFavoriteMap] = useState({});

    const limit = 6;

    const fetchReviews = useCallback(
        async (searchTerm = "", page = 1) => {
            setLoading(true);
            try {
                const res = await axiosSecure.get(`/reviews?search=${searchTerm}&page=${page}&limit=${limit}`);
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
        },
        [axiosSecure, limit]
    );

    useEffect(() => {
        fetchReviews("", 1);
    }, [fetchReviews]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user?.email) {
                setFavoriteMap({});
                return;
            }

            try {
                const res = await axiosSecure.get(`/favorites/${user.email}`);
                const mapped = res.data.reduce((acc, fav) => {
                    acc[fav.review_id] = fav._id;
                    return acc;
                }, {});
                setFavoriteMap(mapped);
            } catch {
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [axiosSecure, user]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews(search.trim(), 1);
    };

    return (
        <div className="app-container py-8">
            <section className="page-hero p-6 sm:p-8">
                <h1 className="section-heading">All Reviews</h1>
                <p className="mt-2 text-sm text-muted">
                    Search through community reviews and discover your next favorite meal.
                </p>

                <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by food name"
                        className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary sm:min-w-28">
                        Search
                    </button>
                </form>
            </section>

            <section className="mt-8">
                {loading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card p-4 animate-pulse">
                                <div className="mb-4 h-48 rounded-xl bg-gray-200 dark:bg-neutral-700" />
                                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-700" />
                                <div className="mb-4 h-3 w-1/2 rounded bg-gray-200 dark:bg-neutral-700" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-700" />
                                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-neutral-700" />
                                </div>
                                <div className="mt-5 h-9 w-full rounded bg-gray-200 dark:bg-neutral-700" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && reviews?.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-muted dark:border-slate-700">
                        No reviews found.
                    </p>
                )}

                {!loading && reviews?.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <SingleReviewCard key={review._id} review={review} favoriteMap={favoriteMap} />
                        ))}
                    </div>
                )}
            </section>

            {!loading && totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => fetchReviews(activeSearch, currentPage - 1)}
                        className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        const isActive = currentPage === page;
                        return (
                            <button
                                key={page}
                                onClick={() => fetchReviews(activeSearch, page)}
                                className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                                    isActive
                                        ? "border-orange-500 bg-orange-500 text-white"
                                        : "border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchReviews(activeSearch, currentPage + 1)}
                        className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
