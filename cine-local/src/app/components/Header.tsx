import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: "#111827", 
      borderBottom: "1px solid #1f2937", 
      padding: "1.5rem 2rem" 
    }}>
      <div style={{ 
        maxWidth: "80rem", 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <div />
        <Link to="/browse" style={{ textDecoration: "none" }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "bold", 
            cursor: "pointer",
            color: "#DC2626",
            letterSpacing: "0.05em"
          }}>
            CINE LOCAL
          </h1>
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{ 
              color: "white", 
              background: "none", 
              border: "none", 
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem"
            }}>
              LOG IN
            </button>
          </Link>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{ 
              backgroundColor: "#DC2626", 
              color: "white", 
              padding: "0.5rem 1.5rem", 
              borderRadius: "0.375rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}>
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
