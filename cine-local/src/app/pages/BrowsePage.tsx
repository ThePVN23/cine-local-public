import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { moviesData } from "../data/movies";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import type { Movie } from "../models/Movie";

export default function BrowsePage() {
  const navigate = useNavigate();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(moviesData);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredMovies(moviesData);
      return;
    }
    const filtered = moviesData.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Header />
      <SearchBar onSearch={handleSearch} />
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 2rem" }}>
        <h2 style={{ 
          color: "white", 
          fontSize: "2.25rem", 
          fontWeight: "bold", 
          marginBottom: "2rem",
          letterSpacing: "0.1em"
        }}>
          {filteredMovies.length === moviesData.length ? "TRENDING MOVIES" : "SEARCH RESULTS"}
        </h2>

        {filteredMovies.length === 0 ? (
          <div style={{ color: "white", fontSize: "1.25rem", textAlign: "center", padding: "5rem 0" }}>
            No movies found. Try a different search.
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "2rem" 
          }}>
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
