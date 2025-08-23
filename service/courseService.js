const Course = require("../models/CourseModel");

class CourseService {
  // --- CRUD ---
  async createCourse(data) {
    const course = new Course(data);
    return await course.save();
  }

  async getAllCourses() {
    return await Course.find().populate("teacherId", "username email");
  }

  async getCourseById(id) {
    return await Course.findById(id).populate("teacherId", "username email");
  }

  async updateCourse(id, data) {
    return await Course.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  async getCoursesByTeacher(teacherId) {
    return await Course.find({ teacherId }).populate("teacherId", "username email");
  }

  async getCoursesByStatus(status) {
    return await Course.find({ status });
  }

  // --- Métiers supplémentaires ---
  async searchByTitle(keyword) {
    return await Course.find({
      title: { $regex: keyword, $options: "i" },
    }).populate("teacherId", "username email");
  }

  async filterByPriceRange(min, max) {
    return await Course.find({
      price: { $gte: min, $lte: max },
    }).populate("teacherId", "username email");
  }

  async sortByPrice(order = "asc") {
    return await Course.find().sort({ price: order === "asc" ? 1 : -1 });
  }

  async sortByDuration(order = "asc") {
    return await Course.find().sort({ duration: order === "asc" ? 1 : -1 });
  }

  async getAvailableCourses() {
    return await Course.find({ status: "disponible" }).populate("teacherId", "username email");
  }
}

module.exports = new CourseService();
