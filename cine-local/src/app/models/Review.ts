import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { type: String, required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { 
  timestamps: true 
});

const Review = models.Review || model('Review', ReviewSchema);

export default Review;
