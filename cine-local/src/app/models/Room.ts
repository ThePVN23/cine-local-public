import { Schema, model, models } from "mongoose";

const RoomSchema = new Schema({
  building: {
    type: String,
    required: true,
    enum: [
      "Zell B. Miller Learning Center", 
      "Shirley Mathis McBay Science Library", 
      "Main Library", 
      "Russell Hall", 
      "Brumby Hall", 
      "Creswell Hall", 
      "Black-Diallo-Miller Hall", 
      "Building 1516",
      "Boyd", 
      "Tate Student Center"
    ], 
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