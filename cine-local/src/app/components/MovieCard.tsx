import { useState } from "react";
import type { Movie } from "../models/Movie";

type Props = {
  movie: Movie;
  onClick?: () => void;
};

export default function MovieCard({ movie, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.2s"
      }}
    >
      <div style={{ 
        backgroundColor: "#1f2937", 
        borderRadius: "0.5rem", 
        overflow: "hidden",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        position: "relative"
      }}>
        <img 
          src={movie.poster} 
          alt={movie.title}
          style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
        />
        {isHovered && (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center"
          }}>
            <div>
              <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {movie.title}
              </h3>
              <p style={{ color: "white", fontSize: "0.875rem" }}>{movie.genre}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
