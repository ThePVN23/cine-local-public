import { NextResponse } from 'next/server';
import Review from '../../models/Review';
import dbConnect from '../../../lib/db';
import User from '../../models/User';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');
    const userId = searchParams.get('userId');

    await dbConnect();

    let reviews;

    if (movieId) {
      reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    } else if (userId) {
      reviews = await Review.find({ userId }).sort({ createdAt: -1 });
    } else {
      reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    }

    return NextResponse.json(reviews, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, username, movieId, movieTitle, rating, comment } = body;

    if (!userId || !movieId || !rating || !comment) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newReview = await Review.create({
      userId,
      username,
      movieId,
      movieTitle,
      rating,
      comment
    });

    return NextResponse.json(
      { message: 'Review added successfully', review: newReview },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
