"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import type { Movie } from "../../models/Movie";
import { fetchMovieDetail } from "../../api/tmdb";
import { useParams } from "next/navigation"; // ✅ NEW

/////////////////////////////////////////

// ---- Temporary logged-in user ----
const currentUserId = "me-123";

// ---- Reviews ----
type Review = {
  id: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
};

// Dummy reviews (your original)
const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    userId: "me-123",
    rating: 5,
    text: "Amazing movie!! Great screenplay.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    userId: "u-456",
    rating: 4,
    text: "Creepy atmosphere and strong performances.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ------------------ Helpers ------------------
function Star({ filled = false, size = 18 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className="text-yellow-400"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 
        3.98a1 1 0 00.95.69h4.187c.969 0 
        1.371 1.24.588 1.81l-3.39 2.463a1 
        1 0 00-.364 1.118l1.286 
        3.98c.3.921-.755 1.688-1.54 
        1.118l-3.39-2.462a1 1 0 
        00-1.176 0l-3.39 
        2.462c-.785.57-1.84-.197-1.54-1.118l1.287-3.98a1 
        1 0 00-.365-1.118L2.938 
        9.407c-.783-.57-.38-1.81.588-1.81h4.187a1 
        1 0 00.95-.69l1.386-3.98z"
      />
    </svg>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < value} />
      ))}
    </div>
  );
}

function StarsInteractive({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        return (
          <button
            key={i}
            type="button"
            className="p-0.5"
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(idx)}
          >
            <Star filled={idx <= shown} size={22} />
          </button>
        );
      })}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// ------------------ Modal ------------------
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-lg ring-1 ring-white/10 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full p-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}

// ------------------ Review Form ------------------
function ReviewForm({
  defaultValue,
  onSubmit,
  submittingLabel = "Save",
}: {
  defaultValue?: Partial<Review>;
  onSubmit: (v: { rating: number; text: string }) => void;
  submittingLabel?: string;
}) {
  const [rating, setRating] = useState(defaultValue?.rating ?? 5);
  const [text, setText] = useState(defaultValue?.text ?? "");

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ rating, text: text.trim() });
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm text-zinc-300">Rating</label>
        <StarsInteractive value={rating} onChange={setRating} />
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-zinc-300">Your Review</label>
        <textarea
          className="min-h-[120px] rounded-xl bg-zinc-800/60 border border-white/10 p-3 text-sm"
          placeholder="Share your thoughts…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-500">
        {submittingLabel}
      </button>
    </form>
  );
}

// ------------------ Review Card ------------------
function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: (r: Review) => void;
  onDelete: (id: string) => void;
}) {
  const isOwner = review.userId === currentUserId;

  return (
    <div className="rounded-2xl bg-red-700/90 p-5 text-white shadow-lg ring-1 ring-black/20">
      <div className="flex justify-between">
        <Stars value={review.rating} />

        {isOwner && (
          <button
            className="text-white/80 hover:bg-black/20 rounded-full p-1"
            onClick={() => onDelete(review.id)}
          >
            ✕
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-6">{review.text}</p>

      <div className="mt-4 flex justify-between text-xs text-white/80">
        <span>{formatDate(review.createdAt)}</span>

        {isOwner ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(review)}
              className="bg-white text-zinc-900 px-3 py-1 rounded-lg hover:bg-zinc-100"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="bg-black/30 px-3 py-1 rounded-lg hover:bg-black/40"
            >
              Delete
            </button>
          </div>
        ) : (
          <span className="opacity-75">by user</span>
        )}
      </div>
    </div>
  );
}

// ------------------ MAIN PAGE ------------------
export default function MovieDetailPage() {
  const params = useParams(); // ✅ use hook instead of props
  const id = params?.id as string;
  const movieId = Number(id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<Review | null>(null);

  useEffect(() => {
    if (!movieId || Number.isNaN(movieId)) return;

    let active = true;

    fetchMovieDetail(movieId)
      .then((m) => active && setMovie(m))
      .catch((e) =>
        active && setErr(e instanceof Error ? e.message : String(e))
      )
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [movieId]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      Math.round(
        (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10
      ) / 10
    );
  }, [reviews]);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <Header onSearch={() => {}} />

      <main className="max-w-6xl mx-auto px-4 pb-24 pt-10">
        {loading && <div className="text-center text-zinc-300">Loading…</div>}
        {err && <div className="text-center text-red-400">Error: {err}</div>}

        {!loading && !err && movie && (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_380px] gap-10">
            {/* Poster */}
            <div>
              <div className="rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
                <img
                  src={movie.poster}
                  className="h-[360px] w-full object-cover md:h-[420px]"
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">Title: {movie.title}</h1>

              <p className="text-zinc-300">
                <span className="font-medium text-white">Genre:</span>{" "}
                {movie.genre}
              </p>

              <p className="text-zinc-300">
                <span className="font-medium text-white">Release Date:</span>{" "}
                {movie.releaseDate}
              </p>

              <div className="space-y-2">
                <div className="font-medium text-white">Overview:</div>
                <p className="leading-7 text-zinc-300 max-w-prose">
                  {movie.overview}
                </p>
              </div>

              <button
                onClick={() => setAddOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-500 mt-2 flex items-center gap-2"
              >
                ＋ Add Review
              </button>
            </div>

            {/* Reviews Panel */}
            <aside className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between">
                  <div className="text-sm text-zinc-300">Average rating</div>
                  <div className="text-xs text-zinc-400">
                    {reviews.length} review
                    {reviews.length !== 1 && "s"}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Stars value={Math.round(avgRating)} />
                  <span className="text-xs text-zinc-400">
                    ({avgRating}/5)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    onEdit={(rv) => setEditOpen(rv)}
                    onDelete={(id) =>
                      setReviews((prev) => prev.filter((x) => x.id !== id))
                    }
                  />
                ))}

                {!reviews.length && (
                  <div className="text-center text-sm text-zinc-400 p-6 border border-white/10 rounded-xl">
                    No reviews yet — be the first to add one.
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Add Review Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={`Add a review for ${movie?.title ?? ""}`}
      >
        <ReviewForm
          onSubmit={(v) => {
            setReviews((prev) => [
              {
                id: Math.random().toString(36).slice(2),
                userId: currentUserId,
                rating: v.rating,
                text: v.text,
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]);
            setAddOpen(false);
          }}
        />
      </Modal>

      {/* Edit Review Modal */}
      <Modal
        open={!!editOpen}
        onClose={() => setEditOpen(null)}
        title="Edit your review"
      >
        {editOpen && (
          <ReviewForm
            defaultValue={editOpen}
            submittingLabel="Update"
            onSubmit={(v) => {
              setReviews((prev) =>
                prev.map((x) =>
                  x.id === editOpen.id ? { ...x, ...v } : x
                )
              );
              setEditOpen(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
