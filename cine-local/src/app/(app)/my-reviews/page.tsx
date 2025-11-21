// src/app/my-reviews/page.tsx
import { auth } from "@/auth";
import MyReviewsClient from "./MyReviewClient";

export default async function MyReviewsPage() {
  const session = await auth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>
      <MyReviewsClient user={session?.user ?? null} />
    </div>
  );
}
