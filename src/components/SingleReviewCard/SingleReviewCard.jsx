import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function SingleReviewCard({ review, favoriteMap }) {
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
        if (!user) {
            setIsFavorite(false);
            setFavoriteId(null);
            return;
        }

        if (favoriteMap) {
            const mappedFavoriteId = favoriteMap[_id] || null;
            setIsFavorite(Boolean(mappedFavoriteId));
            setFavoriteId(mappedFavoriteId);
            return;
        }

        const checkFavorite = async () => {
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
    }, [_id, axiosSecure, favoriteMap, user]);

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
            <FaStar key={i} className="text-amber-400" />
        ) : (
            <FaRegStar key={i} className="text-slate-300 dark:text-slate-600" />
        )
    );

    return (
        <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="relative overflow-hidden">
                <img
                    src={food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={food_name}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                    onClick={handleFavorite}
                    className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5 shadow-md transition hover:scale-110 dark:bg-slate-900"
                    aria-label="Toggle favorite"
                >
                    {isFavorite ? (
                        <FaHeart className="text-xl text-red-500" />
                    ) : (
                        <FaRegHeart className="text-xl text-red-500" />
                    )}
                </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{food_name}</h2>
                    <p className="mt-1 text-sm text-muted">
                        <span className="font-semibold">{restaurant_name}</span> - {location}
                    </p>

                    <div className="mb-3 mt-3 flex items-center gap-1">
                        {stars}
                        <span className="ml-1 text-xs text-muted">({rating})</span>
                    </div>

                    <p className="min-h-[60px] text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
                        {review_text || "No review text provided."}
                    </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <img
                        src={reviewer_image || "https://i.ibb.co/3N1sTkn/user.png"}
                        alt={reviewer_name}
                        className="h-10 w-10 rounded-full border object-cover"
                    />
                    <div className="text-sm">
                        <p className="font-semibold text-slate-900 dark:text-white">{reviewer_name}</p>
                        <p className="text-xs text-muted">{reviewer_email}</p>
                    </div>
                    <p className="ml-auto text-xs text-muted">
                        {new Date(date).toLocaleDateString("en-GB")}
                    </p>
                </div>

                <button onClick={() => navigate(`/review/${_id}`)} className="btn-primary mt-4 w-full">
                    View Details
                </button>
            </div>
        </article>
    );
}
