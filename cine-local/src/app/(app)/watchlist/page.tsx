"use client";

import { auth } from "@/auth";
import WatchlistClient from "../../components/WatchlistClient";
import { useSession } from "next-auth/react";

export default function WatchlistPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <WatchlistClient user={session?.user ?? null} />
  );
}
