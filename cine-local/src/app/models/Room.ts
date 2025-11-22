import { Schema, model, models } from "mongoose";

const RoomSchema = new Schema({
  building: {
    type: String,
    required: true,
    enum: ["MLC", "Boyd", "Main Library", "Brumby Hall", "Russell Hall", "Creswell Hall"], 
  },
  roomNumber: {
    type: String,
    required: true,
  },
  maxOccupancy: {
    type: Number,
    required: true,
  },
});

const Room = models.Room || model("Room", RoomSchema);
export default Room;