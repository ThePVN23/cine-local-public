import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const saved = localStorage.getItem("cineLocalUser");

    if (!saved) {
      alert("No account found. Please sign up first.");
      return;
    }

    const user = JSON.parse(saved);

    if (user.email !== email.trim()) {
      alert("Incorrect email.");
      return;
    }

    if (user.password !== password.trim()) {
      alert("Incorrect password.");
      return;
    }

    // User logged in successfully
    localStorage.setItem("cineLocalUser", JSON.stringify(user));

    navigate("/browse");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      <Header onSearch={() => {}} />

      <div style={{ maxWidth: "28rem", margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ backgroundColor: "#111827", borderRadius: "0.5rem", padding: "2rem" }}>
          <h2
            style={{
              color: "white",
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            LOG IN
          </h2>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: "1rem" }}>
            
            {/* Email */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ color: "#d1d5db" }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ color: "#d1d5db" }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#DC2626",
                color: "white",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Log In
            </button>
          </form>

          <p style={{ color: "#9ca3af", marginTop: "1rem", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#DC2626" }}>Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}



