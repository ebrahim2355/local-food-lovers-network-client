import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function SingleReviewCard({ review }) {
    const {
        _id,
        food_name,
        food_image,
        restaurant_name,
        location,
        rating,
        review_text,
        reviewer_name,
        reviewer_email,
        reviewer_image,
        date,
    } = review;

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!user) return;
            try {
                const res = await axiosSecure.get(`/favorites/${user.email}`);
                const fav = res.data.find((f) => f.review_id === _id);
                if (fav) {
                    setIsFavorite(true);
                    setFavoriteId(fav._id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkFavorite();
    }, [_id, axiosSecure, user]);

    const handleFavorite = async () => {
        if (!user) {
            toast.error("Please login to manage favorites");
            return;
        }

        try {
            if (!isFavorite) {
                const res = await axiosSecure.post("/favorites", {
                    reviewId: _id,
                    user_email: user.email,
                });
                toast.success("Added to favorites");
                setIsFavorite(true);
                setFavoriteId(res.data.insertedId);
            } else {
                if (!favoriteId) return;
                await axiosSecure.delete(`/favorites/${favoriteId}`);
                toast.success("Removed from favorites");
                setIsFavorite(false);
                setFavoriteId(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update favorite");
        }
    };

    const stars = Array.from({ length: 5 }, (_, i) =>
        i < Math.round(rating) ? (
            <FaStar key={i} className="text-yellow-400" />
        ) : (
            <FaRegStar key={i} className="text-gray-400" />
        )
    );

    return (
        <div className="card flex flex-col h-full hover:shadow-xl transition-shadow">
            {/* Image */}
            <div className="relative">
                <img
                    src={food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={food_name}
                    className="w-full h-48 object-cover rounded-t-card rounded-t-md"
                />

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 hover:scale-110 transition"
                    aria-label="Toggle favorite"
                >
                    {isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                    ) : (
                        <FaRegHeart className="text-red-500 text-xl" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <h2 className="text-lg font-bold mb-1">
                        {food_name}
                    </h2>

                    <p className="text-sm opacity-80 mb-1">
                        <span className="font-medium">{restaurant_name}</span> • {location}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                        {stars}
                        <span className="text-xs opacity-70 ml-1">
                            ({rating})
                        </span>
                    </div>

                    <p className="text-sm leading-relaxed line-clamp-3 min-h-[60px] opacity-90">
                        {review_text || "No review text provided."}
                    </p>
                </div>

                {/* Reviewer */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <img
                        src={reviewer_image || "https://i.ibb.co/3N1sTkn/user.png"}
                        alt={reviewer_name}
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div className="text-sm">
                        <p className="font-semibold">{reviewer_name}</p>
                        <p className="text-xs opacity-70">{reviewer_email}</p>
                    </div>
                    <p className="ml-auto text-xs opacity-60">
                        {new Date(date).toLocaleDateString("en-GB")}
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={() => navigate(`/review/${_id}`)}
                    className="btn-primary mt-4 w-full"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
