import type { Movie } from "../models/Movie";

type TMDBMovieRaw = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number; // 0..10
  genre_ids: number[];
};

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Fallback poster if missing
const FALLBACK_POSTER =
  "https://via.placeholder.com/200x300/1f2937/DC2626?text=No+Image";

function toAppMovie(m: TMDBMovieRaw): Movie {
  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : FALLBACK_POSTER,
    genre: "Popular", // TMDB returns genre IDs here; for a quick display we label as Popular
    releaseDate: m.release_date || "—",
    overview: m.overview || "",
    // Convert 0..10 TMDB rating to your 0..5 scale with 1-decimal precision
    rating: Math.round((m.vote_average / 2) * 10) / 10,
  };
}

/**
 * Fetch N popular movies (default 5) from TMDB.
 */
export async function fetchPopularMovies(limit = 5): Promise<Movie[]> {
  const token = process.env.REACT_APP_TMDB_READ_TOKEN;
  if (!token) {
    throw new Error(
      "Missing REACT_APP_TMDB_READ_TOKEN. Add it to your .env and restart the dev server."
    );
  }

  const url = `${TMDB_BASE}/movie/popular?language=en-US&page=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB error ${res.status}: ${text || res.statusText}`);
  }

  const data: { results: TMDBMovieRaw[] } = await res.json();
  return (data.results || []).slice(0, limit).map(toAppMovie);
}
