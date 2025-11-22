import { Schema, model, models } from "mongoose";

const WatchlistMovieSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
  },
  release_date: {
    type: String,
  },
}, { timestamps: true });

WatchlistMovieSchema.index({ userId: 1, id: 1 }, { unique: true });

const WatchlistMovie = models.WatchlistMovie || model("WatchlistMovie", WatchlistMovieSchema);
export default WatchlistMovie;