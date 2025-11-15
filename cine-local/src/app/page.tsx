"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/cine-local-backdrop.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4) grayscale(100%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(135deg, #1f2937 25%, transparent 25%), linear-gradient(225deg, #1f2937 25%, transparent 25%)",
          backgroundSize: "20px 20px",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1.5rem",
        }}
      >
        <button
          onClick={() => router.push("/login")}
          style={{
            color: "white",
            background: "none",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          LOG IN
        </button>
        <button
          onClick={() => router.push("/signup")}
          style={{
            backgroundColor: "#DC2626",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#B91C1C")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#DC2626")
          }
        >
          SIGN UP
        </button>
      </div>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#DC2626",
            letterSpacing: "0.1em",
          }}
        >
          CINE LOCAL
        </h1>
        <p style={{ color: "white", fontSize: "1.5rem", marginBottom: "2rem" }}>
          Discover, discuss, and review. Localizing all your film reviews and
          thoughts.
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
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#374151")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f2937")
          }
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}