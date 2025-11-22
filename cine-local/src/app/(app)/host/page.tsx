"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Room = {
  _id: string;
  building: string;
  roomNumber: string;
  maxOccupancy: number;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};

type Screening = {
  _id: string;
  movieTitle: string;
  moviePoster: string;
  startTime: string;
  room: {
    building: string;
    roomNumber: string;
  };
  attendees: string[];
  maxAttendees: number;
};

export default function HostPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Form State
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Room State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [currentMaxOccupancy, setCurrentMaxOccupancy] = useState<number | string>("-");

  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // My Hostings State
  const [myHostings, setMyHostings] = useState<Screening[]>([]);

  // 1. Fetch Rooms and User's Hostings on Load
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Rooms
      const roomRes = await fetch("/api/rooms");
      if (roomRes.ok) {
        const data: Room[] = await roomRes.json();
        setRooms(data);
        // Extract unique buildings
        const uniqueBuildings = Array.from(new Set(data.map(r => r.building)));
        setBuildings(uniqueBuildings);
      }

      // Fetch My Hostings
      if (session?.user) {
        const userId = (session.user as any).id;
        const hostRes = await fetch(`/api/screenings?hostId=${userId}`);
        if (hostRes.ok) {
          const data = await hostRes.json();
          setMyHostings(data);
        }
      }
    };
    fetchData();
  }, [session]);

  // 2. Handle Room Logic
  useEffect(() => {
    if (selectedBuilding) {
      const filtered = rooms.filter(r => r.building === selectedBuilding);
      setFilteredRooms(filtered);
      setSelectedRoomId(""); // Reset room when building changes
      setCurrentMaxOccupancy("-");
    } else {
      setFilteredRooms([]);
    }
  }, [selectedBuilding, rooms]);

  useEffect(() => {
    const room = rooms.find(r => r._id === selectedRoomId);
    if (room) {
      setCurrentMaxOccupancy(room.maxOccupancy);
    } else {
      setCurrentMaxOccupancy("-");
    }
  }, [selectedRoomId, rooms]);

  // 3. Movie Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2 && !selectedMovie) {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&include_adult=false&language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`, 
            },
          }
        );
        const data = await res.json();
        setSuggestions(data.results ? data.results.slice(0, 5) : []);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedMovie]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setQuery(movie.title);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedMovie || !selectedRoomId || !startTime) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie.id.toString(),
          movieTitle: selectedMovie.title,
          moviePoster: selectedMovie.poster_path,
          roomId: selectedRoomId,
          startTimeString: startTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create hosting.");
      } else {
        router.push("/watchlist");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white", paddingTop: "4rem", textAlign: "center" }}>
        <h1>Please log in to host a screening.</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "white",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* HOSTING FORM */}
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem", color: "#DC2626", textAlign: "center" }}>
          Host a Screening
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#111827",
            padding: "2rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            marginBottom: "4rem"
          }}
        >
          {error && (
            <div style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", border: "1px solid #DC2626", color: "#ef4444", padding: "0.75rem", borderRadius: "0.375rem" }}>
              {error}
            </div>
          )}

          {/* 1. MOVIE SEARCH WITH IMAGES */}
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Select Movie</label>
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedMovie(null);
              }}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: "#374151", border: "1px solid #4b5563", color: "white", outline: "none" }}
            />
            {suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.375rem", marginTop: "0.25rem", zIndex: 50 }}>
                {suggestions.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #374151", display: 'flex', alignItems: 'center', gap: '1rem' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {movie.poster_path && (
                      <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} style={{ width: "40px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{movie.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{movie.release_date?.split("-")[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. BUILDING | ROOM | CAPACITY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.5fr", gap: "1rem" }}>
            
            {/* Building */}
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Building</label>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: "#374151", border: "1px solid #4b5563", color: "white", outline: "none" }}
              >
                <option value="">Select Building</option>
                {buildings.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Room */}
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Room</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                disabled={!selectedBuilding}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: "#374151", border: "1px solid #4b5563", color: "white", outline: "none", opacity: !selectedBuilding ? 0.5 : 1 }}
              >
                <option value="">Select Room</option>
                {filteredRooms.map((room) => (
                  <option key={room._id} value={room._id}>{room.roomNumber}</option>
                ))}
              </select>
            </div>

            {/* Capacity (Read Only) */}
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Attendees</label>
              <div style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: "#111827", border: "1px solid #4b5563", color: "#9ca3af", textAlign: "center" }}>
                {currentMaxOccupancy}
              </div>
            </div>
          </div>

          {/* 3. CALENDAR */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Date & Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: "#374151", border: "1px solid #4b5563", color: "white", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#DC2626", color: "white", padding: "0.75rem", borderRadius: "0.375rem", fontWeight: "bold", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "1rem" }}
          >
            {loading ? "Scheduling..." : "Create Hosting"}
          </button>
        </form>


        {/* MY HOSTINGS SECTION */}
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#22c55e", borderBottom: "1px solid #22c55e", paddingBottom: "0.5rem" }}>
          🎥 My Active Hostings
        </h2>

        {myHostings.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>You are not hosting any screenings yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {myHostings.map((screening) => (
              <div key={screening._id} style={{ backgroundColor: "#111827", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid #374151" }}>
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
                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#22c55e", fontWeight: "bold" }}>
                      {screening.attendees.length} / {screening.maxAttendees} Attendees
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}