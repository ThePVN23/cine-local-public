"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // success → send to login
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "28rem", margin: "0 auto", padding: "5rem 2rem" }}>
      <div
        style={{
          backgroundColor: "#111827",
          borderRadius: 8,
          padding: "2rem",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          SIGN UP
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220,38,38,0.2)",
              color: "#fca5a5",
              padding: 12,
              borderRadius: 6,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSignup}
          style={{ display: "grid", gap: 16 }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ color: "#d1d5db" }}>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              style={{
                padding: 12,
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#fff",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ color: "#d1d5db" }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: 12,
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#fff",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ color: "#d1d5db" }}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              style={{
                padding: 12,
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#fff",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#991b1b" : "#DC2626",
              color: "#fff",
              padding: 12,
              borderRadius: 6,
              fontWeight: 600,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p
          style={{
            color: "#9ca3af",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#DC2626" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
