import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type HeaderProps = {
  onSearch: (query: string) => void;
};

type User = {
  name: string;
  email: string;
  password: string;
} | null;

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("cineLocalUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  function handleLogout() {
    setUser(null);
    navigate("/login");
  }

  return (
    <header
      style={{
        backgroundColor: "#111827",
        borderBottom: "1px solid #1f2937",
        padding: "3rem 2rem 4rem",
      }}
    >
      {/* TOP RIGHT BUTTONS */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {user ? (
            <>
              <span
                style={{
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Welcome, {user.name}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#DC2626",
                  color: "white",
                  padding: "0.4rem 1rem",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    color: "white",
                    background: "none",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  LOG IN
                </button>
              </Link>

              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    backgroundColor: "#DC2626",
                    color: "white",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "0.375rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* TITLE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Link to="/browse" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#DC2626",
              letterSpacing: "0.05em",
            }}
          >
            CINE LOCAL
          </h1>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "1.2rem 1.5rem",
            borderRadius: "9999px",
            backgroundColor: "white",
            color: "#111827",
            fontSize: "1.125rem",
            border: "none",
            outline: "none",
          }}
        />
      </div>
    </header>
  );
}






