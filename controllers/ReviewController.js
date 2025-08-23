// controllers/ReviewController.js
const ReviewService = require('../service/ReviewService');

class ReviewController {
  async createReview(req, res) {
    try {
      const review = await ReviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await ReviewService.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReviewById(req, res) {
    try {
      const review = await ReviewService.getReviewById(req.params.id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReview(req, res) {
    try {
      const review = await ReviewService.updateReview(req.params.id, req.body);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteReview(req, res) {
    try {
      await ReviewService.deleteReview(req.params.id);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();
