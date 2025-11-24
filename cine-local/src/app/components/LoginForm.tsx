"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, 
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/browse");
      router.refresh(); 
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "28rem", margin: "0 auto", padding: "5rem 2rem" }}>
      <div
        style={{
          backgroundColor: "#111827",
          borderRadius: "0.5rem",
          padding: "2rem",
        }}
      >
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

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              color: "#fca5a5",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "grid", gap: "1rem" }}
        >
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
              required
            />
          </div>

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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#991b1b" : "#DC2626",
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              fontWeight: 600,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#DC2626" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
