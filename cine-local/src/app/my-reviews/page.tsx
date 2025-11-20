"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

type Review = {
  _id: string;
  movieId: string;
  movieTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function MyReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [posters, setPosters] = useState<Record<string, string>>({});
  const [activeReviewIndex, setActiveReviewIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedUser = localStorage.getItem("cineLocalUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchMyReviews(parsedUser._id);
    } else {
      router.push("/login");
    }
  }, []);

  async function fetchMyReviews(userId: string) {
    try {
      const res = await fetch(`/api/reviews?userId=${userId}`);
      if (res.ok) {
        const data: Review[] = await res.json();
        setReviews(data);
        fetchPosters(data);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosters(reviewData: Review[]) {
    const uniqueMovieIds = Array.from(new Set(reviewData.map(r => r.movieId)));
    
    const posterPromises = uniqueMovieIds.map(movieId => 
      fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2QyZTVkYzE0OGRmZDBkOTcxOTU0ZDhmMTU1NjM3NiIsIm5iZiI6MTY5NjI1NjUxMi44MjgsInN1YiI6IjY1MWFkMjAwMjIzYThiMDBlMWZhYTgzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f9vm8QNqNiFkDjF_2V5-457fhLsE6j5jAGZNslC_LcQ`
        }
      })
        .then(res => res.json())
        .then(data => ({ movieId, poster_path: data.poster_path }))
        .catch(error => ({ movieId, poster_path: null }))
    );

    const posterResults = await Promise.all(posterPromises);
    
    const posterMap = posterResults.reduce((acc, current) => {
      acc[current.movieId] = current.poster_path;
      return acc;
    }, {} as Record<string, string>);
    
    setPosters(posterMap);
  }

  const groupedReviews = useMemo(() => {
    return reviews.reduce((groups, review) => {
      const key = review.movieTitle;
      if (!groups[key]) groups[key] = [];
      groups[key].push(review);
      return groups;
    }, {} as Record<string, Review[]>);
  }, [reviews]);

  const handleNextReview = (movieTitle: string, totalReviews: number) => {
    setActiveReviewIndex(prev => ({
      ...prev,
      [movieTitle]: (prev[movieTitle] || 0) + 1 >= totalReviews ? 0 : (prev[movieTitle] || 0) + 1,
    }));
  };

  const handlePrevReview = (movieTitle: string, totalReviews: number) => {
    setActiveReviewIndex(prev => ({
      ...prev,
      [movieTitle]: (prev[movieTitle] || 0) - 1 < 0 ? totalReviews - 1 : (prev[movieTitle] || 0) - 1,
    }));
  };

  async function handleDelete(reviewId: string, movieTitle: string) {
    if (!confirm(`Delete this review for ${movieTitle}?`)) return;
    const userId = user?._id;
    if (!userId) return;

    try {
        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }), 
        });

        if (res.ok) setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (e) {
        console.error("Fetch error during delete:", e);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <Header onSearch={() => {}} />
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#DC2626" }}>My Reviews</h1>

        {loading && <p style={{ color: "#9ca3af" }}>Loading your reviews...</p>}
        
        {!loading && reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#111827", borderRadius: "0.5rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>You haven't written any reviews yet.</h3>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "3rem" }}>
            {Object.entries(groupedReviews).map(([movieTitle, reviewGroup]) => {
              const activeIndex = activeReviewIndex[movieTitle] || 0;
              const latestReview = reviewGroup[activeIndex];
              const isMultipleReviews = reviewGroup.length > 1;
              const posterPath = posters[latestReview.movieId];
              
              return (
                <div key={movieTitle} style={{ 
                  display: "flex", 
                  gap: "2rem", 
                  backgroundColor: "#1f2937", 
                  padding: "2rem", 
                  borderRadius: "0.75rem", 
                  border: "1px solid #374151" 
                }}>
                  <div style={{ flexShrink: 0, width: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
                    <Link href={`/movieDetailPage/${latestReview.movieId}`}>
                      <img 
                        src={posterPath ? `https://image.tmdb.org/t/p/w300${posterPath}` : 'https://via.placeholder.com/120x180?text=No+Poster'} 
                        alt={movieTitle} 
                        style={{ width: "100%", borderRadius: "0.5rem", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }}
                      />
                    </Link>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginTop: "0.5rem", textAlign: "center" }}>
                        {movieTitle}
                    </h3>
                  </div>

                  <div style={{ flexGrow: 1, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #374151", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                        <h4 style={{ color: "#9ca3af", textTransform: "uppercase", fontSize: "0.9rem" }}>
                            Your Review {isMultipleReviews && ` (${activeIndex + 1} of ${reviewGroup.length})`}
                        </h4>
                        <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                            {new Date(latestReview.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div style={{ minHeight: "150px" }}>
                        <div style={{ color: "#fbbf24", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                            {"★".repeat(latestReview.rating)}{"☆".repeat(5 - latestReview.rating)}
                        </div>
                        <p style={{ lineHeight: "1.6", color: "#d1d5db", marginBottom: "1rem", fontSize: "1.1rem", fontStyle: "italic" }}>
                            "{latestReview.comment}"
                        </p>
                        <button 
                            onClick={() => handleDelete(latestReview._id, movieTitle)}
                            style={{ 
                                backgroundColor: "#991b1b",
                                color: "white", 
                                border: "none", 
                                padding: "0.5rem 1rem", 
                                borderRadius: "0.25rem",
                                fontWeight: "bold",
                                cursor: "pointer", 
                                fontSize: "0.9rem"
                            }}
                        >
                            Delete Review
                        </button>
                    </div>

                    {isMultipleReviews && (
                        <div style={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => handlePrevReview(movieTitle, reviewGroup.length)} style={{ padding: "0.5rem 1rem", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>
                                &lt; Prev
                            </button>
                            <button onClick={() => handleNextReview(movieTitle, reviewGroup.length)} style={{ padding: "0.5rem 1rem", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>
                                Next &gt;
                            </button>
                        </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
