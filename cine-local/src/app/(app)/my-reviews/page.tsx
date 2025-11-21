"use client";
import { auth } from "@/auth";
import MyReviewsClient from "../../components/MyReviewClient";
import { useSession } from "next-auth/react";

export default function MyReviewsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <MyReviewsClient user={session?.user ?? null} />
    </div>
  );
}
