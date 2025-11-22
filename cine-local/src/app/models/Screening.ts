import { Schema, model, models } from "mongoose";

const ScreeningSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  moviePoster: {
    type: String,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  maxAttendees: {
    type: Number,
    required: true, 
  }
}, { timestamps: true });

ScreeningSchema.index({ room: 1, startTime: 1, endTime: 1 });

const Screening = models.Screening || model("Screening", ScreeningSchema);
export default Screening;