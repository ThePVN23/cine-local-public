"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "white",
        textAlign: "center",
        padding: "2rem"
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>
        404
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Oops — The page you’re looking for does not exist.
      </p>

      <Link
        href="browse/"
        style={{
          padding: "0.75rem 1.25rem",
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontSize: "1rem",
          border: "1px solid #374151"
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}