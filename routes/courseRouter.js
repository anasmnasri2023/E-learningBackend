const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// --- CRUD ---
router.post("/", courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

// --- Extra métiers ---
router.get("/teacher/:teacherId", courseController.getCoursesByTeacher);
router.get("/status/:status", courseController.getCoursesByStatus);
router.get("/search/title", courseController.searchByTitle); // ?keyword=node
router.get("/filter/price", courseController.filterByPriceRange); // ?min=50&max=200
router.get("/sort/price", courseController.sortByPrice); // ?order=asc|desc
router.get("/sort/duration", courseController.sortByDuration); // ?order=asc|desc
router.get("/available", courseController.getAvailableCourses);

module.exports = router;
