"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

type WatchlistMovie = {
  _id: string;
  tmdbId: string;
  title: string;
  poster_path: string;
  release_date: string;
};

export default function WatchlistPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("cineLocalUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchWatchlist(parsedUser._id);
    } else {
      router.push("/login");
    }
  }, []);

  async function fetchWatchlist(userId: string) {
    try {
      const res = await fetch(`/api/watchlist?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch {
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
        body: JSON.stringify({ userId: user._id, movieId }),
      });
    } catch {
      alert("Failed to remove movie");
      fetchWatchlist(user._id);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <Header onSearch={() => {}} />
      
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#DC2626" }}>
          My Watchlist
        </h1>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>Loading your saved movies...</p>
        ) : watchlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#111827", borderRadius: "0.5rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Your watchlist is empty</h3>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
              Go explore movies and save the ones you want to see!
            </p>
            <Link href="/browse">
              <button style={{ backgroundColor: "#DC2626", color: "white", padding: "0.75rem 2rem", borderRadius: "9999px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
                Browse Movies
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
            {watchlist.map((movie) => (
              <div key={movie._id} style={{ backgroundColor: "#1f2937", borderRadius: "0.5rem", overflow: "hidden", transition: "transform 0.2s" }}>
                <Link href={`/movieDetailPage/${movie.tmdbId}`}>
                  <div style={{ cursor: "pointer", overflow: "hidden" }}>
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    ) : (
                      <div style={{ height: "300px", backgroundColor: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div style={{ padding: "1rem" }}>
                  <Link href={`/movieDetailPage/${movie.tmdbId}`} style={{ textDecoration: "none", color: "white" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {movie.title}
                    </h3>
                  </Link>
                  <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "1rem" }}>
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </p>
                  <button 
                    onClick={() => handleRemove(movie._id)}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      color: "#ef4444",
                      border: "1px solid #ef4444",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "white"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
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
