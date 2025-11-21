import { NextResponse } from 'next/server';
import Review from '../../../models/Review';
import dbConnect from '../../../../../config/mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const body = await req.json();
    const { userId, rating, comment } = body;

    await dbConnect();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (review.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    return NextResponse.json({ message: 'Review updated', review }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const body = await req.json();
    const { userId } = body;

    await dbConnect();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (review.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Review deleted' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}