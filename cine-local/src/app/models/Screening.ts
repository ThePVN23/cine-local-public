import mongoose, { Schema, model, models } from 'mongoose';

const ScreeningSchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  movieTitle: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Screening = models.Screening || model('Screening', ScreeningSchema);
export default Screening;
