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
} = require('../controllers/tourController');
const { protect } = require('./../controllers/authController.js');
const catchAsync = require('./../service/catchAsync');

const router = express.Router();

router
  .route('/')
  .get(protect, getAllTours)
  .post(catchAsync(createTour));

router
  .route('/:id')
  .get(catchAsync(getTourById))
  .patch(catchAsync(updateTour))
  .delete(catchAsync(deleteTour));

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
