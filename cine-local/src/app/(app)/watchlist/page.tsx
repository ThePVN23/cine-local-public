import { auth } from "@/auth";
import WatchlistClient from "./WatchlistClient";

export default async function WatchlistPage() {
  const session = await auth();

  return (
    <WatchlistClient user={session?.user ?? null} />
  );
}
