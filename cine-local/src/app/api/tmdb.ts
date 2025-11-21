import type { Movie } from "../models/Movie";

type TMDBMovieRaw = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
};

type TMDBMovieDetail = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
};

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER =
  "https://via.placeholder.com/200x300/1f2937/DC2626?text=No+Image";

function toAppMovie(m: TMDBMovieRaw): Movie {
  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : FALLBACK_POSTER,
    genre: "Popular",
    releaseDate: m.release_date || "—",
    overview: m.overview || "",
    rating: Math.round((m.vote_average / 2) * 10) / 10,
  };
}

function toAppMovieDetail(m: TMDBMovieDetail): Movie {
  return {
    id: m.id,
    title: m.title,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : FALLBACK_POSTER,
    genre: m.genres.map((g) => g.name).join(", "),
    releaseDate: m.release_date || "—",
    overview: m.overview || "",
    rating: Math.round((m.vote_average / 2) * 10) / 10,
  };
}

export async function fetchMovieDetail(movieId: number): Promise<Movie> {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2RkNGVmZmMzMTgyYjU3NzhiYTdlYWFkMTZiY2RjNiIsIm5iZiI6MTc2MTkzMDQzMS45MTEsInN1YiI6IjY5MDRlY2JmNmI5ZTVhYzZiZDRjN2JlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CHajXVPPAOvNlSiGcu_LnRPLPfpYfA4eBGr6hYj8sqQ"
  if (!token)
    throw new Error("Missing NEXT_PUBLIC_TMDB_READ_TOKEN in .env.local");

  const url = `${TMDB_BASE}/movie/${movieId}?language=en-US`;
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

  const data: TMDBMovieDetail = await res.json();
  return toAppMovieDetail(data);
}

export async function fetchPopularMovies(limit = 5): Promise<Movie[]> {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2RkNGVmZmMzMTgyYjU3NzhiYTdlYWFkMTZiY2RjNiIsIm5iZiI6MTc2MTkzMDQzMS45MTEsInN1YiI6IjY5MDRlY2JmNmI5ZTVhYzZiZDRjN2JlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CHajXVPPAOvNlSiGcu_LnRPLPfpYfA4eBGr6hYj8sqQ"
  if (!token)
    throw new Error("Missing NEXT_PUBLIC_TMDB_READ_TOKEN in .env.local");

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

export async function searchMovies(query: string): Promise<Movie[]> {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2RkNGVmZmMzMTgyYjU3NzhiYTdlYWFkMTZiY2RjNiIsIm5iZiI6MTc2MTkzMDQzMS45MTEsInN1YiI6IjY5MDRlY2JmNmI5ZTVhYzZiZDRjN2JlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CHajXVPPAOvNlSiGcu_LnRPLPfpYfA4eBGr6hYj8sqQ"
  if (!token)
    throw new Error("Missing NEXT_PUBLIC_TMDB_READ_TOKEN in .env.local");

  const url = `${TMDB_BASE}/search/movie?language=en-US&page=1&query=${encodeURIComponent(
    query
  )}`;

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
  return (data.results || []).slice(0, 10).map(toAppMovie);
}
