import Review from '../models/review.js';
import User from '../models/user.js';
import { reviewSchema } from '../validations/reviewValidation.js';

export const createReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const newReview = await Review.create({
      user: userId,
      name: user.name,
      surname: user.surname,
      text: req.body.text,
      photo: req.body.photo || null,
    });

    res
      .status(201)
      .json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
