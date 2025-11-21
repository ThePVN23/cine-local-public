
import { auth } from "@/auth";
import BrowseClient from "./BrowseClient";

export default async function BrowsePage() {
  const session = await auth(); 

  return (
    <BrowseClient user={session?.user ?? null} />
  );
}
