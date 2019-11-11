const express = require('express');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  getCheaperTours,
  getExpensiveTours,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');
const { protect, restrict } = require('./../controllers/authController');
const catchAsync = require('./../service/catchAsync');

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(protect, createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(protect, updateTour)
  .delete(protect, restrict('admin', 'lead-guide'), deleteTour);

router
  .route('/cheaper-tours')
  .get(getCheaperTours, getAllTours);

router
  .route('/expensive-tours')
  .get(getExpensiveTours, getAllTours);

router
  .route('/stats')
  .get(catchAsync(getTourStats));

router
  .route('/plans/:year')
  .get(catchAsync(getMonthlyPlan));

module.exports = router;
