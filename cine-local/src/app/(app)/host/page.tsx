// src/app/host/page.tsx
import { auth } from "@/auth";
import HostClient from "./HostClient";

export default async function HostPage() {
  const session = await auth();

  return <HostClient user={session?.user ?? null} />;
}
