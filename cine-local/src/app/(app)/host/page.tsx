"use client";

import { useSession } from "next-auth/react"; // or "@auth/nextjs" depending on your setup
import HostClient from "../../components/HostClient";

export default function HostPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <HostClient user={session?.user ?? null} />;
}
