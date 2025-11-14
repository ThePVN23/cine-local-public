"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#000", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ 
        position: "absolute",
        inset: 0,
        opacity: 0.3,
        backgroundImage: "linear-gradient(135deg, #1f2937 25%, transparent 25%), linear-gradient(225deg, #1f2937 25%, transparent 25%)",
        backgroundSize: "20px 20px"
      }} />
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{ 
          fontSize: "6rem", 
          fontWeight: "bold", 
          marginBottom: "2rem",
          color: "#DC2626",
          letterSpacing: "0.1em"
        }}>
          CINE LOCAL
        </h1>
        <p style={{ color: "white", fontSize: "1.5rem", marginBottom: "2rem" }}>
          Discover and Review Local Cinema
        </p>
        <button
          onClick={() => router.push("/browse")}
          style={{
            backgroundColor: "#1f2937",
            color: "white",
            padding: "1rem 3rem",
            borderRadius: "0.375rem",
            fontSize: "1.25rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}
