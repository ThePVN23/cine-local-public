"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type WatchlistMovie = {
  _id: string;
  tmdbId: string;
  title: string;
  poster_path: string;
  release_date: string;
};

type WatchlistClientProps = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function WatchlistClient({ user }: WatchlistClientProps) {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    fetchWatchlist();
  }, [user?.id]);

  async function fetchWatchlist() {
    try {
      const res = await fetch(`/api/watchlist?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch (err) {
      console.error("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(movieId: string) {
    setWatchlist(watchlist.filter((m) => m._id !== movieId));

    try {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
    } catch {
      alert("Failed to remove movie");
      fetchWatchlist();
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#DC2626" }}>
          My Watchlist
        </h1>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>Loading your saved movies...</p>
        ) : watchlist.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              backgroundColor: "#111827",
              borderRadius: "0.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Your watchlist is empty
            </h3>
            <Link href="/browse">
              <button
                style={{
                  backgroundColor: "#DC2626",
                  color: "white",
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Browse Movies
              </button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {watchlist.map((movie) => (
              <div key={movie._id} style={{ backgroundColor: "#1f2937", borderRadius: "0.5rem" }}>
                <Link href={`/movieDetailPage/${movie.tmdbId}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: "100%" }}
                  />
                </Link>

                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{movie.title}</h3>

                  <button
                    onClick={() => handleRemove(movie._id)}
                    style={{
                      marginTop: "1rem",
                      width: "100%",
                      color: "#ef4444",
                      border: "1px solid #ef4444",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
