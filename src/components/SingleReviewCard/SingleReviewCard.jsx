import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function SingleReviewCard({ review }) {
    const {
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
        favorites,
    } = review;

    // For rating display
    const stars = Array.from({ length: 5 }, (_, i) =>
        i < Math.round(rating) ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />
    );

    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 w-full">
            {/* Food Image */}
            <div className="relative">
                <img
                    src={food_image || "https://i.ibb.co/3N1sTkn/user.png"}
                    alt={food_name}
                    className="w-full h-48 object-cover"
                />
                {favorites && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 text-xs rounded-full">
                        ❤️ Favorite
                    </span>
                )}
            </div>

            {/* Review Details */}
            <div className="p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-1">{food_name}</h2>
                    <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">{restaurant_name}</span> • {location}
                    </p>

                    <div className="flex items-center gap-1 mb-3">{stars}</div>

                    <p className="text-gray-700 text-sm line-clamp-3">
                        {review_text || "No review text provided."}
                    </p>
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center gap-3 mt-5 pt-3 border-t border-gray-100">
                    <img
                        src={
                            reviewer_image ||
                            "https://i.ibb.co/3N1sTkn/user.png"
                        }
                        alt={reviewer_name}
                        className="w-10 h-10 rounded-full border"
                    />
                    <div className="text-sm">
                        <h3 className="font-semibold text-gray-800">{reviewer_name}</h3>
                        <p className="text-gray-500 text-xs">{reviewer_email}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-400">
                        {new Date(date).toLocaleDateString("en-GB")}
                    </div>
                </div>
            </div>
        </div>
    );
}
