"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import MovieDetailClient from "../../../components/MovieDetailClient";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id;

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <MovieDetailClient
      movieId={id as string}
      user={session?.user ?? null}
    />
  );
}
