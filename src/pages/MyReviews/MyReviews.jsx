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
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await axiosSecure.delete(`/reviews/${id}`);
                        if (res.data.deletedCount > 0) {
                            Swal.close();
                            toast.success("Review deleted successfully");
                            // setTimeout(() => {}, 1200);
                            setReviews(reviews.filter((r) => r._id !== id));
                        }
                        else{
                            toast.error("Failed to delete review");
                        }
                    }
                    catch (err) {
                        console.log(err);
                        Swal.close();
                        toast.error("Something went wrong while deleting review");
                    }
                }
            })

    };

    if (loading) return <p className="text-center py-10 text-gray-500">Loading your reviews...</p>;

    if (reviews.length === 0)
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold">No reviews found 😢</h2>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">My Reviews</h2>
            <Toaster />
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="table w-full">
                    <thead className="bg-gray-200">
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
                                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
