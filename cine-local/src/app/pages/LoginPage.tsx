import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Header />
      <div style={{ maxWidth: "28rem", margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ backgroundColor: "#111827", borderRadius: "0.5rem", padding: "2rem" }}>
          <h2 style={{ color: "white", fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
            LOG IN
          </h2>
          <p style={{ color: "#9ca3af", textAlign: "center", marginBottom: "2rem" }}>
            Login functionality coming soon!
          </p>
          <Link to="/browse" style={{ textDecoration: "none" }}>
            <button style={{ 
              width: "100%", 
              backgroundColor: "#DC2626", 
              color: "white", 
              padding: "0.75rem", 
              borderRadius: "0.375rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}>
              Back to Browse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
