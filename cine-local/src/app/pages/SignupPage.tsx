import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    // Save user info including password
    const user = {
      name,
      email,
      password,
    };

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
            SIGN UP
          </h2>

          <form onSubmit={handleSignup} style={{ display: "grid", gap: "1rem" }}>
            
            {/* Full Name */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ color: "#d1d5db" }}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                placeholder="Create a password"
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
              Create Account
            </button>
          </form>

          <p style={{ color: "#9ca3af", marginTop: "1rem", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#DC2626" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}




