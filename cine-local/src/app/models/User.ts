import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    match: [/.+\@.+\..+/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false 
  },
  watchlist: [{
    type: Schema.Types.ObjectId,
    ref: 'WatchlistMovie' 
  }],
  screeningsHosted: [{
    type: Schema.Types.ObjectId,
    ref: 'Screening'
  }],
  screeningsAttended: [{
    type: Schema.Types.ObjectId,
    ref: 'Screening'
  }],
}, {
  timestamps: true 
});

const User = models.User || model('User', UserSchema);

export default User;
