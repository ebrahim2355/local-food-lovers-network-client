import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function MyReviews() {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (user?.email) {
            axiosSecure
                .get(`/reviews/user/${user.email}`)
                .then((res) => {
                    setReviews(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error("Failed to fetch reviews");
                    setLoading(false);
                });
        }
    }, [user, axiosSecure]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This review will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/reviews/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Review deleted successfully");
                        setReviews(reviews.filter((r) => r._id !== id));
                    } else {
                        toast.error("Failed to delete review");
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Something went wrong while deleting review");
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="app-container py-10">
                <div className="mb-6 h-8 w-44 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />
                    ))}
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="app-container py-16 text-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">No reviews found</h2>
                <p className="mt-2 text-sm text-muted">Start by adding your first review.</p>
            </div>
        );
    }

    return (
        <div className="app-container py-8">
            <div className="mb-6">
                <h2 className="section-heading">My Reviews</h2>
                <p className="mt-1 text-sm text-muted">Manage, edit, or remove your submitted reviews.</p>
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left">Food</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Restaurant</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review._id} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                                <td className="px-4 py-3">
                                    <img src={review.food_image} alt={review.food_name} className="h-14 w-14 rounded-lg object-cover" />
                                </td>
                                <td className="px-4 py-3 font-medium">{review.food_name}</td>
                                <td className="px-4 py-3">{review.restaurant_name}</td>
                                <td className="px-4 py-3">{new Date(review.date).toLocaleDateString()}</td>
                                <td className="space-x-2 px-4 py-3">
                                    <button onClick={() => navigate(`/review/${review._id}`)} className="btn-outline py-1.5 text-xs">
                                        View
                                    </button>
                                    <button onClick={() => navigate(`/edit-review/${review._id}`)} className="btn-outline py-1.5 text-xs">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid gap-4 md:hidden">
                {reviews.map((review) => (
                    <div key={review._id} className="card p-4">
                        <button onClick={() => navigate(`/review/${review._id}`)} className="flex w-full items-center gap-4 text-left">
                            <img src={review.food_image} alt={review.food_name} className="h-20 w-20 rounded-lg object-cover" />
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{review.food_name}</h3>
                                <p className="text-sm text-muted">{review.restaurant_name}</p>
                                <p className="text-xs text-muted">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        </button>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => navigate(`/edit-review/${review._id}`)} className="btn-outline w-full py-2 text-sm">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(review._id)}
                                className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
