import mongoose, { Schema, model, models } from 'mongoose';

const WatchlistMovieSchema = new Schema({
  tmdbId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  poster_path: { type: String },
  release_date: { type: String },
}, { timestamps: true });

const WatchlistMovie = models.WatchlistMovie || model('WatchlistMovie', WatchlistMovieSchema);

export default WatchlistMovie;
