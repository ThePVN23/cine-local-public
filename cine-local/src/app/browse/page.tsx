"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/Header";
import type { Movie } from "../models/Movie";
import { fetchPopularMovies } from "../api/tmdb";




import MovieCard from "../components/MovieCard";



export default function BrowsePage() {
  const router = useRouter();

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load from TMDB
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const movies = await fetchPopularMovies(5); 
        if (!isMounted) return;

        console.log("TMDB movies:", movies); 

        setAllMovies(movies);
        setFilteredMovies(movies);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load movies.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query: string) => {
    
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Header onSearch={function (query: string): void {
        throw new Error("Function not implemented.");
      } } />
      
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 2rem" }}>
        <h2
          style={{
            color: "white",
            fontSize: "2.25rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            letterSpacing: "0.1em",
          }}
        >
          {filteredMovies.length === allMovies.length ? "TRENDING MOVIES" : "SEARCH RESULTS"}
        </h2>

        {error && (
            <div style={{ color: "red", fontSize: "1.2rem", marginBottom: "1rem" }}>
                {error}
            </div>
        )}

        {!loading && !error && filteredMovies.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => router.push(`/movieDetailPage/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
