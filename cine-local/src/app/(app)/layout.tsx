import { ReactNode } from "react";
import { auth } from "@/auth";
import Header from "../components/Header";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <>
      <Header user={session?.user ?? null} />
      {children}
    </>
  );
}
