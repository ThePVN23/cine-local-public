"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};

type Screening = {
  _id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  startTime: string;
  room: {
    building: string;
    roomNumber: string;
  };
  attendees: string[];
  maxAttendees: number;
  host: {
    username: string;
  };
};

export default function WatchlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const [watchlistRes, screeningsRes] = await Promise.all([
          fetch("/api/watchlist"),
          fetch("/api/screenings"),
        ]);

        const watchlistData = await watchlistRes.json();
        const screeningsData = await screeningsRes.json();

        setWatchlist(watchlistData.watchlist || []);
        setScreenings(screeningsData || []);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleRemove = async (movieId: number) => {
    const res = await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId }),
    });
    if (res.ok) {
      setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
    }
  };

  const handleRSVP = async (screeningId: string) => {
    const res = await fetch("/api/screenings/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screeningId }),
    });
    if (res.ok) {
      const updatedScreenings = await (await fetch("/api/screenings")).json();
      setScreenings(updatedScreenings);
      alert("RSVP Successful!");
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", paddingTop: "4rem" }}>
        <div style={{ color: "white", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", paddingTop: "4rem", textAlign: "center" }}>
        <h1 style={{ color: "white" }}>Please Log In to view your Watchlist</h1>
      </div>
    );
  }

  const activeScreenings = screenings.filter((screening) =>
    watchlist.some((movie) => movie.id.toString() === screening.movieId)
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white", paddingTop: "3rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 2rem" }}>
        
        {activeScreenings.length > 0 && (
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#22c55e", borderBottom: "1px solid #22c55e", paddingBottom: "0.5rem" }}>
              ⚡ Screening Now
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {activeScreenings.map((screening) => {
                const isAttending = screening.attendees.includes((session.user as any).id);
                const isFull = screening.attendees.length >= screening.maxAttendees;

                if (isFull && !isAttending) return null;

                return (
                  <div key={screening._id} style={{ backgroundColor: "#111827", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid #374151", position: "relative" }}>
                    <div style={{ display: "flex" }}>
                      <img
                        src={`https://image.tmdb.org/t/p/w200${screening.moviePoster}`}
                        alt={screening.movieTitle}
                        style={{ width: "100px", objectFit: "cover" }}
                      />
                      <div style={{ padding: "1rem", flex: 1 }}>
                        <h3 style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{screening.movieTitle}</h3>
                        <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                          📍 {screening.room.building} {screening.room.roomNumber}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                          🕒 {new Date(screening.startTime).toLocaleString()}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "1rem" }}>
                          👤 Host: {screening.host.username}
                        </p>
                        
                        {isAttending ? (
                          <div style={{ color: "#22c55e", fontWeight: "bold", fontSize: "0.9rem" }}>
                            ✓ You are attending
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRSVP(screening._id)}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              backgroundColor: "#22c55e",
                              color: "white",
                              border: "none",
                              borderRadius: "0.375rem",
                              fontWeight: "bold",
                              cursor: "pointer"
                            }}
                          >
                            RSVP ({screening.attendees.length}/{screening.maxAttendees})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem", color: "#DC2626" }}>
          My Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>Your watchlist is empty.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
            {watchlist.map((movie) => (
              <div key={movie.id} style={{ position: "relative", transition: "transform 0.2s" }}>
                <Link href={`/movieDetailPage/${movie.id}`}>
                  <div style={{ position: "relative", borderRadius: "0.5rem", overflow: "hidden", aspectRatio: "2/3", cursor: "pointer" }}>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                        No Image
                      </div>
                    )}
                  </div>
                </Link>
                
                <div style={{ marginTop: "0.75rem" }}>
                  <h3 style={{ fontWeight: "bold", fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {movie.title}
                  </h3>
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(movie.id)}
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    padding: "0.5rem",
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    color: "#ef4444",
                    borderRadius: "0.375rem",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}