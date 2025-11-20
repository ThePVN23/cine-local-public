"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type HeaderProps = {
  onSearch: (query: string) => void;
};

type User = {
  _id: string;
  username: string;
  email: string;
} | null;

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("cineLocalUser") : null;
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    
    const urlSearch = searchParams.get("search");
    if (urlSearch) setQuery(urlSearch);

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2QyZTVkYzE0OGRmZDBkOTcxOTU0ZDhmMTU1NjM3NiIsIm5iZiI6MTY5NjI1NjUxMi44MjgsInN1YiI6IjY1MWFkMjAwMjIzYThiMDBlMWZhYTgzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f9vm8QNqNiFkDjF_2V5-457fhLsE6j5jAGZNslC_LcQ`
            }
          });
          const data = await res.json();
          if (data.results) {
            setSuggestions(data.results.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Search error", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const performSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/browse?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  function handleLogout() {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("cineLocalUser");
    router.push("/login");
  }

  return (
    <header style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", padding: "3rem 2rem 4rem" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", position: "relative" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: "none", border: "none", color: "white", fontSize: "1rem", fontWeight: 500, cursor: "pointer" }}>
                Welcome, {user.username} ▼
              </button>

              {showDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  width: "200px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 999
                }}>
                  <Link href="/watchlist" style={{ display: "block", padding: "0.75rem 1rem", color: "white", textDecoration: "none", borderBottom: "1px solid #374151" }}>📺 Watchlist</Link>
                  <Link href="/host" style={{ display: "block", padding: "0.75rem 1rem", color: "white", textDecoration: "none", borderBottom: "1px solid #374151" }}>🎟️ Host a Screening</Link>
                  <Link href="/my-reviews" style={{ display: "block", padding: "0.75rem 1rem", color: "white", textDecoration: "none", borderBottom: "1px solid #374151" }}>
                    📝 My Reviews
                  </Link>
                  <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", backgroundColor: "transparent", color: "#fca5a5", border: "none", cursor: "pointer", fontWeight: "bold" }}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login"><button style={{ color: "white", background: "none", border: "none", fontWeight: 600, cursor: "pointer" }}>LOG IN</button></Link>
              <Link href="/signup"><button style={{ backgroundColor: "#DC2626", color: "white", padding: "0.5rem 1.5rem", borderRadius: "0.375rem", fontWeight: 600, border: "none", cursor: "pointer" }}>SIGN UP</button></Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <Link href="/browse" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", cursor: "pointer", color: "#DC2626", letterSpacing: "0.05em" }}>CINE LOCAL</h1>
        </Link>
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 2rem" }} ref={wrapperRef}>
        <div style={{ position: "relative", width: "100%" }}>
          <input 
            type="text" 
            placeholder="Search for movies..." 
            value={query} 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} 
            onFocus={() => { if (query.length > 2 && suggestions.length > 0) setShowSuggestions(true); }}
            style={{ width: "100%", padding: "1.2rem 3.5rem 1.2rem 1.5rem", borderRadius: "9999px", backgroundColor: "white", color: "#111827", fontSize: "1.125rem", border: "none", outline: "none" }} 
          />
          
          <button 
            onClick={performSearch}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#DC2626",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}
            title="Search"
          >
            🔍
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "110%",
              left: "0",
              right: "0",
              backgroundColor: "#1f2937",
              borderRadius: "0.5rem",
              border: "1px solid #374151",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              zIndex: 100,
              overflow: "hidden"
            }}>
              {suggestions.map((movie) => (
                <Link 
                  key={movie.id} 
                  href={`/movieDetailPage/${movie.id}`}
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #374151",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    color: "white"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={movie.title}
                        style={{ width: "40px", height: "60px", objectFit: "cover", borderRadius: "4px", marginRight: "1rem" }} 
                      />
                    ) : (
                      <div style={{ width: "40px", height: "60px", backgroundColor: "#111827", borderRadius: "4px", marginRight: "1rem" }} />
                    )}
                    
                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "0.25rem" }}>{movie.title}</p>
                      <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                        {movie.release_date ? movie.release_date.split("-")[0] : "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
