import { NextResponse } from 'next/server';
import User from '../../models/User';
import WatchlistMovie from '../../models/WatchlistMovie';
import dbConnect from '../../../../config/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, tmdbId, title, poster_path, poster, release_date, releaseDate } = body;

    await dbConnect();

    let movie = await WatchlistMovie.findOne({ tmdbId });
    
    if (!movie) {
      movie = await WatchlistMovie.create({ 
        tmdbId, 
        title, 
        poster_path: poster_path || poster, 
        release_date: release_date || releaseDate 
      });
    }

    const user = await User.findById(userId);
    if (!user.watchlist.includes(movie._id)) {
      user.watchlist.push(movie._id);
      await user.save();
    }

    return NextResponse.json({ message: 'Added to watchlist' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    await dbConnect();

    const user = await User.findById(userId).populate('watchlist');

    return NextResponse.json(user ? user.watchlist : [], { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, movieId } = body;

    await dbConnect();

    await User.findByIdAndUpdate(userId, {
      $pull: { watchlist: movieId }
    });

    return NextResponse.json({ message: 'Removed from watchlist' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
