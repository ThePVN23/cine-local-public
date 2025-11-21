"use client";

import { useSession } from "next-auth/react"; // or "@auth/nextjs" depending on setup
import BrowseClient from "../../components/BrowseClient";

export default function BrowsePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <BrowseClient user={session?.user ?? null} />;
}
