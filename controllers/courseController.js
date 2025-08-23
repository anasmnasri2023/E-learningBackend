const courseService = require("../service/courseService");

module.exports = {
  // --- CRUD ---
  createCourse: async (req, res) => {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await courseService.getCourseById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const deleted = await courseService.deleteCourse(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCoursesByTeacher: async (req, res) => {
    try {
      const courses = await courseService.getCoursesByTeacher(req.params.teacherId);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCoursesByStatus: async (req, res) => {
    try {
      const courses = await courseService.getCoursesByStatus(req.params.status);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // --- Métiers supplémentaires ---
  searchByTitle: async (req, res) => {
    try {
      const { keyword } = req.query;
      const courses = await courseService.searchByTitle(keyword);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  filterByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      const courses = await courseService.filterByPriceRange(Number(min), Number(max));
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sortByPrice: async (req, res) => {
    try {
      const { order } = req.query; // "asc" ou "desc"
      const courses = await courseService.sortByPrice(order);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sortByDuration: async (req, res) => {
    try {
      const { order } = req.query; // "asc" ou "desc"
      const courses = await courseService.sortByDuration(order);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAvailableCourses: async (req, res) => {
    try {
      const courses = await courseService.getAvailableCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
