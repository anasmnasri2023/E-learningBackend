// services/ReviewService.js
const Review = require('../models/ReviewModel');

class ReviewService {
  async createReview(data) {
    return await Review.create(data);
  }

  async getAllReviews() {
    return await Review.find().populate('userId').populate('courseId');
  }

  async getReviewById(id) {
    return await Review.findById(id).populate('userId').populate('courseId');
  }

  async updateReview(id, data) {
    return await Review.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteReview(id) {
    return await Review.findByIdAndDelete(id);
  }
}

module.exports = new ReviewService();
