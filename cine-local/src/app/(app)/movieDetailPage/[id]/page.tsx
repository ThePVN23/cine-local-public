// src/app/movieDetailPage/[id]/page.tsx
import { auth } from "@/auth";
import MovieDetailClient from "./MovieDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MovieDetailPage({ params }: PageProps) {
  
  const { id } = await params;

  const session = await auth();

  return (
    <MovieDetailClient
      movieId={id}
      user={session?.user ?? null}
    />
  );
}
