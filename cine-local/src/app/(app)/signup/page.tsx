"use client";

import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import SignupForm from "../../components/SignupForm";
import { auth } from "@/auth";

export default function SignupPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      
      <SignupForm />
    </div>
  );
}
