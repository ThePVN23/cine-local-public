import { Link, useNavigate, useParams } from "react-router-dom";
import { Star, Plus, Bookmark } from "lucide-react";
import Header from "../components/Header";
import { moviesData } from "../data/movies";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = moviesData.find((m) => m.id === Number(id));

  if (!movie) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
        <Header />
        <div style={{ color: "white", textAlign: "center", padding: "5rem 0" }}>
          <h2 style={{ fontSize: "1.875rem", marginBottom: "1rem" }}>Movie not found</h2>
          <button 
            onClick={() => navigate("/browse")}
            style={{
              color: "#DC2626",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Return to browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Header />
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div style={{ width: "320px", flexShrink: 0 }}>
            <div style={{ 
              backgroundColor: "#1f2937", 
              borderRadius: "0.5rem", 
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}>
              <img 
                src={movie.poster} 
                alt={movie.title}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, color: "white" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              {movie.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={24}
                    fill={i < Math.floor(movie.rating) ? "#DC2626" : "none"}
                    stroke="#DC2626"
                  />
                ))}
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{movie.rating}/5</span>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 600 }}>Genre:</span> {movie.genre}
              </p>
              <p style={{ fontSize: "1.25rem" }}>
                <span style={{ fontWeight: 600 }}>Release Date:</span> {movie.releaseDate}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>Overview</h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "#d1d5db" }}>
                {movie.overview}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                disabled
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#374151",
                  color: "#9ca3af",
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  cursor: "not-allowed",
                  opacity: 0.5,
                  border: "none"
                }}
                title="Login to add reviews"
              >
                <Plus size={20} />
                Add Review
              </button>

              <button 
                disabled
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#374151",
                  color: "#9ca3af",
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  cursor: "not-allowed",
                  opacity: 0.5,
                  border: "none"
                }}
                title="Login to add to watchlist"
              >
                <Bookmark size={20} />
                Add to Watchlist
              </button>
            </div>

            <p style={{ color: "#9ca3af", marginTop: "1rem", fontSize: "0.875rem" }}>
              <Link to="/login" style={{ color: "#DC2626" }}>Log in</Link> or{" "}
              <Link to="/signup" style={{ color: "#DC2626" }}>sign up</Link> to add reviews and create watchlists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
