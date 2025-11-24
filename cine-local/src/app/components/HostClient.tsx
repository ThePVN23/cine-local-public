"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
} | null;

type HostClientProps = {
  user: SessionUser;
};

export default function HostClient({ user }: HostClientProps) {
  const router = useRouter();

  const [movieTitle, setMovieTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("Ciné");
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    if (!user?.id) {
      router.push("/login");
    }
  }, [user?.id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.id) {
      alert("Please log in first");
      router.push("/login");
      return;
    }

    const res = await fetch("/api/screenings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostId: user.id,
        hostName: user.name || user.email || "Anonymous",
        movieTitle,
        date,
        time,
        location,
        message,
      }),
    });

    if (res.ok) {
      alert("Screening Hosted!");
      router.push("/browse");
    } else {
      alert("Failed to create screening.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            color: "#DC2626",
          }}
        >
          Host a Screening
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "1.5rem",
            backgroundColor: "#111827",
            padding: "2rem",
            borderRadius: "0.5rem",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Movie Title
            </label>
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.25rem",
                border: "none",
              }}
              placeholder="e.g. Tron: Ares"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.25rem",
                  border: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.25rem",
                  border: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.25rem",
                border: "none",
              }}
            >
              <option value="Ciné">Ciné (Athens)</option>
              <option value="Beechwood">Beechwood Cinemas</option>
              <option value="University 16">University 16</option>
              <option value="Tate Center">Tate Center</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.25rem",
                border: "none",
                height: "100px",
              }}
              placeholder="Let's meet in the lobby 10 mins before!"
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#DC2626",
              color: "white",
              padding: "1rem",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
