import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";
import { toast } from "react-hot-toast";
import Slider from "react-slick";

const banners = [
    {
        id: 1,
        image: "https://plus.unsplash.com/premium_photo-1672938878598-31c1c614f708",
        title: "Delicious Meals",
        subtitle: "Experience the best flavors!",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1542444256-164bd32f11fc",
        title: "Tasty Treats",
        subtitle: "Find top-rated foods near you!",
    },
    {
        id: 3,
        image: "https://plus.unsplash.com/premium_photo-1672363353881-68c8ff594e25",
        title: "Food Lovers Unite",
        subtitle: "Reviews you can trust!",
    },
];

export default function Home() {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [featuredReviews, setFeaturedReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedReviews = async () => {
            try {
                const res = await axiosSecure.get("/reviews");
                // frontend-safe top-rated fallback
                const topRated = [...res.data]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 6);
                setFeaturedReviews(topRated);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load featured reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedReviews();
    }, [axiosSecure]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    };

    return (
        <div className="min-h-screen">

            {/* HERO / SLIDER */}
            <section className="mb-14">
                <Slider {...settings}>
                    {banners.map((banner) => (
                        <div key={banner.id} className="relative h-[50vh] max-h-[700px]">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
                                <h1 className="text-3xl sm:text-5xl font-bold text-white">
                                    {banner.title}
                                </h1>
                                <p className="mt-3 text-lg text-gray-200 max-w-xl">
                                    {banner.subtitle}
                                </p>
                                <button
                                    onClick={() => navigate("/all-reviews")}
                                    className="btn-primary mt-6"
                                >
                                    Show All Reviews
                                </button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            {/* FEATURED REVIEWS */}
            <section className="max-w-7xl mx-auto px-4 mb-16">
                <h2 className="section-title text-center mb-8 text-3xl font-bold">
                    Top Rated Reviews
                </h2>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card p-4 animate-pulse">
                                {/* Image */}
                                <div className="h-48 rounded-lg bg-gray-200 dark:bg-neutral-700 mb-4" />

                                {/* Title */}
                                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-700 mb-2" />

                                {/* Meta */}
                                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-neutral-700 mb-4" />

                                {/* Description */}
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-700" />
                                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-neutral-700" />
                                </div>

                                {/* Button */}
                                <div className="h-9 w-full rounded bg-gray-200 dark:bg-neutral-700 mt-5" />
                            </div>
                        ))}
                    </div>
                ) : featuredReviews.length === 0 ? (

                    <p className="text-center text-muted">
                        No featured reviews found.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredReviews.map((review) => (
                            <SingleReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                )}
            </section>

            {/* WHY SECTION */}
            <section className="card max-w-7xl mx-auto px-6 py-12 text-center mb-16">
                <h2 className="section-title mb-4 text-3xl font-bold">Why Local Food Lovers?</h2>
                <p className="text-muted max-w-2xl mx-auto mb-6">
                    Discover honest reviews, top-rated dishes, and hidden gems in your city.
                    Join a community of food enthusiasts who help each other choose better.
                </p>
                <button
                    onClick={() => navigate("/add-review")}
                    className="btn-primary"
                >
                    Add Your Review
                </button>
            </section>

            {/* CTA SECTION */}
            <section className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="section-title mb-4 text-3xl font-bold">Explore More</h2>
                <p className="text-muted max-w-2xl mx-auto mb-6">
                    Browse all reviews and discover what people are loving right now.
                </p>
                <button
                    onClick={() => navigate("/all-reviews")}
                    className="btn-primary"
                >
                    Explore All Reviews
                </button>
            </section>
        </div>
    );
}
