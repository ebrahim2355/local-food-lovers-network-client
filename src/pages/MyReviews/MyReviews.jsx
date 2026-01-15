import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast, { Toaster } from "react-hot-toast";
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
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/reviews/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.close();
                        toast.success("Review deleted successfully");
                        setReviews(reviews.filter((r) => r._id !== id));
                    } else {
                        toast.error("Failed to delete review");
                    }
                } catch (err) {
                    console.log(err);
                    Swal.close();
                    toast.error("Something went wrong while deleting review");
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen max-w-6xl mx-auto p-4 pt-10 pb-20">
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
                    My Reviews
                </h2>

                {/* Desktop Skeleton */}
                <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                    <table className="table w-full">
                        <thead className="dark:bg-gray-500">
                            <tr>
                                <th>Food Image</th>
                                <th>Food Name</th>
                                <th>Restaurant</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td>
                                        <div className="w-16 h-16 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-28 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-16 bg-gray-200 rounded" />
                                            <div className="h-8 w-16 bg-gray-200 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Skeleton */}
                <div className="md:hidden flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="flex gap-4 p-4 items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="flex justify-end p-4 gap-2">
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (reviews.length === 0)
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold">No reviews found 😢</h2>
            </div>
        );

    return (
        <div className="min-h-screen max-w-6xl mx-auto p-4 pt-10 pb-20">
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">My Reviews</h2>
            <Toaster />

            {/* Table layout for medium+ screens */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
                <table className="table w-full">
                    <thead className=" dark:bg-gray-500">
                        <tr>
                            <th>Food Image</th>
                            <th>Food Name</th>
                            <th>Restaurant</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review._id} className="hover:bg-gray-50">
                                <td>
                                    <img
                                        src={review.food_image}
                                        alt={review.food_name}
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                </td>
                                <td className="font-medium">{review.food_name}</td>
                                <td>{review.restaurant_name}</td>
                                <td>{new Date(review.date).toLocaleDateString()}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => navigate(`/edit-review/${review._id}`)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card layout for small screens */}
            <div className=" md:hidden flex flex-col gap-4">
                {reviews.map((review) => (
                    <div key={review._id} className="card">
                        <div className="flex gap-4 p-4 items-center">
                            <img
                                src={review.food_image}
                                alt={review.food_name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{review.food_name}</h3>
                                <p className="text-sm text-gray-500">{review.restaurant_name}</p>
                                <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 gap-2">
                            <button
                                onClick={() => navigate(`/edit-review/${review._id}`)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(review._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
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
