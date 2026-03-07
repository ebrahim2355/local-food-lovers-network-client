import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SingleReviewCard from "../../components/SingleReviewCard/SingleReviewCard";
import { toast } from "react-hot-toast";
import Slider from "react-slick";
import useAuth from "../../hooks/useAuth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const banners = [
    {
        id: 1,
        image: "https://plus.unsplash.com/premium_photo-1672938878598-31c1c614f708",
        title: "Discover dishes worth talking about",
        subtitle: "Explore trusted reviews from real local food lovers.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1542444256-164bd32f11fc",
        title: "Find the city's top flavors",
        subtitle: "Browse trending meals, hidden gems, and new favorites.",
    },
    {
        id: 3,
        image: "https://plus.unsplash.com/premium_photo-1672363353881-68c8ff594e25",
        title: "Share your honest review",
        subtitle: "Help others choose better places to eat.",
    },
];

const foodCategories = [
    { name: "Street Food", desc: "Quick bites loved by locals." },
    { name: "Traditional", desc: "Classic dishes with rich heritage." },
    { name: "Desserts", desc: "Sweet endings worth every calorie." },
    { name: "BBQ & Grill", desc: "Smoky flavors and juicy textures." },
];

const communityFeedback = [
    {
        name: "Arif Hasan",
        quote: "I discovered amazing hidden restaurants through this platform.",
    },
    {
        name: "Nusrat Jahan",
        quote: "The reviews feel honest and actually help me pick where to eat.",
    },
    {
        name: "Tanvir Rahman",
        quote: "Saving favorites and revisiting them later is super useful.",
    },
];

export default function Home() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [featuredReviews, setFeaturedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteMap, setFavoriteMap] = useState({});

    useEffect(() => {
        const fetchFeaturedReviews = async () => {
            try {
                const res = await axiosSecure.get("/reviews");
                const reviews = res.data.reviews || [];
                const topRated = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 6);
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 750,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: true,
        prevArrow: <HeroArrow direction="left" />,
        nextArrow: <HeroArrow direction="right" />,
    };

    return (
        <div className="space-y-16 pb-16">
            <section className="mx-auto mt-6 w-[min(1400px,98vw)] px-2 sm:px-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/10 dark:border-slate-800">
                    <Slider {...settings}>
                        {banners.map((banner) => (
                            <div key={banner.id} className="relative h-[56vh] max-h-[620px] min-h-[360px]">
                                <img src={banner.image} alt={banner.title} className="block h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/25" />
                                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-16">
                                    <p className="mb-3 w-fit rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-orange-200">
                                        Local Food Lovers Network
                                    </p>
                                    <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
                                        {banner.title}
                                    </h1>
                                    <p className="mt-4 max-w-xl text-sm text-slate-100 sm:text-base">
                                        {banner.subtitle}
                                    </p>
                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <button onClick={() => navigate("/all-reviews")} className="btn-primary">
                                            Explore Reviews
                                        </button>
                                        <button onClick={() => navigate("/add-review")} className="btn-outline border-white/70 bg-white/20 text-white hover:bg-white/30">
                                            Add Your Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section className="app-container">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="section-heading">Top Rated Reviews</h2>
                        <p className="mt-1 text-sm text-muted">Curated from the highest-rated dishes on the platform.</p>
                    </div>
                    <button onClick={() => navigate("/all-reviews")} className="hidden text-sm font-semibold text-orange-500 hover:text-orange-600 sm:block">
                        View all
                    </button>
                </div>

                {loading ? (
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
                ) : featuredReviews.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-muted dark:border-slate-700">
                        No featured reviews found.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredReviews.map((review) => (
                            <SingleReviewCard key={review._id} review={review} favoriteMap={favoriteMap} />
                        ))}
                    </div>
                )}
            </section>

            <section className="app-container pt-20">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="card-soft p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Reviews</p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">4.2K+</h3>
                    </div>
                    <div className="card-soft p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Active Foodies</p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">1.8K+</h3>
                    </div>
                    <div className="card-soft p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Cities Covered</p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">35+</h3>
                    </div>
                    <div className="card-soft p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Saved Favorites</p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">12K+</h3>
                    </div>
                </div>
            </section>

            <section className="app-container pt-20">
                <div className="mb-5">
                    <h2 className="section-heading">Explore by Category</h2>
                    <p className="mt-1 text-sm text-muted">
                        Jump into food styles you love and find reviews faster.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {foodCategories.map((item) => (
                        <article key={item.name} className="card p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                            <p className="mt-2 text-sm text-muted">{item.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="app-container pt-20">
                <div className="card p-8">
                    <h2 className="section-heading text-center">What Food Lovers Say</h2>
                    <p className="mt-2 text-center text-sm text-muted">
                        Real experiences from our growing community.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {communityFeedback.map((item) => (
                            <div key={item.name} className="card-soft p-5">
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                    "{item.quote}"
                                </p>
                                <p className="mt-4 text-sm font-semibold text-orange-500">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="app-container grid gap-6 md:grid-cols-2 pt-20">
                <div className="page-hero p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Why people trust this network</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                        Real reviews, clean rating breakdowns, and a community-first experience.
                        No noise, just useful opinions to help you decide where to eat next.
                    </p>
                    <button onClick={() => navigate("/add-review")} className="btn-outline mt-6">
                        Add Your Review
                    </button>
                </div>
                <div className="card-soft p-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to discover more?</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                        Jump into the full reviews directory and filter by your cravings.
                    </p>
                    <button onClick={() => navigate("/all-reviews")} className="btn-outline mt-6 bottom-0">
                        Browse Your Reviews
                    </button>
                </div>
            </section>
        </div>
    );
}

function HeroArrow({ className, style, onClick, direction }) {
    const isLeft = direction === "left";
    return (
        <button
            type="button"
            aria-label={isLeft ? "Previous slide" : "Next slide"}
            className={`${className} !flex !h-11 !w-11 !items-center !justify-center rounded-full !bg-black/45 !text-white backdrop-blur-sm transition hover:!bg-black/70`}
            style={{
                ...style,
                zIndex: 20,
                [isLeft ? "left" : "right"]: "16px",
            }}
            onClick={onClick}
        >
            {isLeft ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
        </button>
    );
}
