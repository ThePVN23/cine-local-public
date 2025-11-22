"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Review = {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string | null;
  release_date: string;
  genres: { name: string }[];
  vote_average: number;
};

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
} | null;

type Props = {
  movieId: string;
  user: SessionUser;
};

export default function MovieDetailClient({ movieId, user }: Props) {
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistMongoId, setWatchlistMongoId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (!movieId) return;

    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2QyZTVkYzE0OGRmZDBkOTcxOTU0ZDhmMTU1NjM3NiIsIm5iZiI6MTY5NjI1NjUxMi44MjgsInN1YiI6IjY1MWFkMjAwMjIzYThiMDBlMWZhYTgzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f9vm8QNqNiFkDjF_2V5-457fhLsE6j5jAGZNslC_LcQ",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch from TMDB");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?movieId=${movieId}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function checkWatchlistStatus() {
      const userId = user?.id;
      if (!userId) return;

      try {
        const res = await fetch(`/api/watchlist?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          // Handle structure: { watchlist: [...] }
          const watchlist = data.watchlist || [];
          const foundMovie = watchlist.find(
            (m: any) => m.id.toString() === movieId.toString()
          );
          if (foundMovie) {
            setIsInWatchlist(true);
            setWatchlistMongoId(foundMovie.id.toString());
          } else {
            setIsInWatchlist(false);
            setWatchlistMongoId(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovie();
    fetchReviews();
    checkWatchlistStatus();
  }, [movieId, user?.id]);

  async function handleAddToWatchlist() {
    if (!user?.id || !movie) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        }),
      });

      if (res.ok) {
        setIsInWatchlist(true);
        // Refresh to get the new ID
        const checkRes = await fetch(`/api/watchlist?userId=${user.id}`);
        const data = await checkRes.json();
        const watchlist = data.watchlist || [];
        const found = watchlist.find(
          (m: any) => m.id.toString() === movieId.toString()
        );
        if (found) setWatchlistMongoId(found.id.toString());
      } else {
        // FIX: Safely handle non-JSON error responses (like 500 server crashes)
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          alert(data.error || data.message || "Failed to add to watchlist");
        } catch {
          console.error("API Crash Response:", text);
          alert("Server Error: Check your VS Code terminal for details.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  }

  async function handleRemoveFromWatchlist() {
    if (!user?.id) return;

    try {
      const res = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie?.id,
        }),
      });

      if (res.ok) {
        setIsInWatchlist(false);
        setWatchlistMongoId(null);
      } else {
        alert("Failed to remove from watchlist");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) {
      alert("Please log in first");
      return;
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId,
        movieTitle: movie?.title || "Unknown",
        rating: newRating,
        comment: newComment,
        userId: user.id,
        username: user.name || user.email,
      }),
    });

    if (res.ok) {
      const { review } = await res.json();
      setReviews((prev) => [review, ...prev]);
      setShowAddForm(false);
      setNewComment("");
      setNewRating(5);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("Delete this review?")) return;
    if (!user?.id) return;

    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (res.ok) setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  }

  async function handleUpdate(reviewId: string) {
    if (!user?.id) return;

    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        rating: editRating,
        comment: editComment,
      }),
    });
    if (res.ok) {
      const { review: updatedReview } = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? updatedReview : r))
      );
      setEditingReviewId(null);
    }
  }

  if (!movie) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>Loading...</div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80vh",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: movie.backdrop_path
              ? "brightness(0.4)"
              : "brightness(0.4) blur(20px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, #000 100%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "3rem 2rem",
            display: "flex",
            gap: "3rem",
            alignItems: "flex-start",
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "1rem",
              objectFit: "cover",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          />

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "0.5rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {movie.title}
            </h1>
            <p style={{ color: "#d1d5db", marginBottom: "1.5rem" }}>
              {movie.release_date} •{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "2rem",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              {movie.overview}
            </p>

            {user && !showAddForm && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "3rem",
                }}
              >
                {isInWatchlist ? (
                  <button
                    onClick={handleRemoveFromWatchlist}
                    style={{
                      backgroundColor: "#991b1b",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "9999px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#7f1d1d")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#991b1b")
                    }
                  >
                    ❌ Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={handleAddToWatchlist}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "9999px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    + Add to Watchlist
                  </button>
                )}
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "9999px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Write a Review
                </button>
              </div>
            )}

            {user && showAddForm && (
              <form
                onSubmit={handleAddReview}
                style={{
                  marginTop: "1rem",
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>Write a Review</h3>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Rating: </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.25rem",
                      backgroundColor: "#374151",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Your thoughts..."
                  required
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "0.5rem",
                    backgroundColor: "#1f2937",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    marginBottom: "1rem",
                  }}
                />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#DC2626",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#9ca3af",
                      border: "1px solid #9ca3af",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div style={{ marginTop: "3rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #374151",
                  paddingBottom: "0.5rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Reviews ({reviews.length})
              </h2>

              {user ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      backgroundColor: "rgba(153, 27, 27, 0.8)",
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      marginBottom: "1rem",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    {editingReviewId === review._id ? (
                      <div>
                        <select
                          value={editRating}
                          onChange={(e) =>
                            setEditRating(Number(e.target.value))
                          }
                          style={{
                            marginBottom: "0.5rem",
                            color: "black",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={editComment}
                          onChange={(e) =>
                            setEditComment(e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            color: "black",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <button
                          onClick={() => handleUpdate(review._id)}
                          style={{
                            marginRight: "0.5rem",
                            backgroundColor: "white",
                            color: "black",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReviewId(null)}
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              color: "#fbbf24",
                              fontSize: "1.2rem",
                            }}
                          >
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <span
                            style={{
                              fontSize: "0.9rem",
                              color: "#fca5a5",
                            }}
                          >
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}{" "}
                            by {review.username}
                          </span>
                        </div>
                        <p style={{ lineHeight: "1.5" }}>
                          {review.comment}
                        </p>
                        {user?.id === review.userId && (
                          <div
                            style={{
                              marginTop: "1rem",
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() => {
                                setEditingReviewId(review._id);
                                setEditComment(review.comment);
                                setEditRating(review.rating);
                              }}
                              style={{
                                backgroundColor: "white",
                                color: "#991b1b",
                                border: "none",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              style={{
                                backgroundColor: "black",
                                color: "white",
                                border: "none",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "3rem",
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    borderRadius: "0.75rem",
                    textAlign: "center",
                    border: "1px solid #374151",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Community Reviews Hidden
                  </h3>
                  <p
                    style={{
                      color: "#d1d5db",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Please log in to see what others are saying.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    style={{
                      backgroundColor: "#DC2626",
                      color: "white",
                      padding: "0.75rem 2rem",
                      borderRadius: "9999px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}