import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";
import { toast } from "react-hot-toast";

const banners = [
    { id: 1, image: "https://i.ibb.co.com/356Cbs3b/download-1.jpg", title: "Delicious Meals", subtitle: "Experience the best flavors!" },
    { id: 2, image: "https://plus.unsplash.com/premium_photo-1664472680005-b9976125009d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870", title: "Tasty Treats", subtitle: "Find top-rated foods near you!" },
    { id: 3, image: "https://plus.unsplash.com/premium_photo-1672363353881-68c8ff594e25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", title: "Food Lovers Unite", subtitle: "Reviews you can trust!" },
];

export default function Home() {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [featuredReviews, setFeaturedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchFeaturedReviews = async () => {
            try {
                const res = await axiosSecure.get("/reviews?sort=rating");
                setFeaturedReviews(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load featured reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedReviews();
    }, [axiosSecure]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen">

            <section className="relative w-full h-64 sm:h-96 overflow-hidden rounded-lg mb-10">
                {banners.map((banner, idx) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
                    >
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white p-4">
                            <h1 className="text-2xl sm:text-4xl font-bold">{banner.title}</h1>
                            <p className="mt-2 sm:text-lg">{banner.subtitle}</p>
                            <button
                                onClick={() => navigate("/all-reviews")}
                                className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-semibold transition cursor-pointer"
                            >
                                Show All Reviews
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            <section className="max-w-7xl mx-auto px-4 mb-10">
                <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Top Reviews</h2>
                {loading ? (
                    <p className="text-center text-orange-600 text-xl">Loading featured reviews...</p>
                ) : featuredReviews.length === 0 ? (
                    <p className="text-center text-gray-500">No featured reviews found.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredReviews.map((review) => (
                            <SingleReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-orange-50 py-12 px-4 text-center mb-10 rounded-lg max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Why Food Lovers?</h2>
                <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                    Discover honest reviews, top-rated dishes, and hidden gems in your city. Join a community of food enthusiasts who share their experiences and help you make the best choices.
                </p>
                <button
                    onClick={() => navigate("/add-review")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
                >
                    Add Your Review
                </button>
            </section>

            <section className="py-12 px-4 text-center max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Explore More</h2>
                <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                    Check out the latest trending foods and restaurants near you. Our curated list makes sure you never miss the best dining experiences.
                </p>
                <button
                    onClick={() => navigate("/all-reviews")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
                >
                    Explore All Reviews
                </button>
            </section>
        </div>
    );
}
