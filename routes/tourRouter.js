const express = require('express');

const router = express.Router();
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

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

router
  .route('/cheaper-tours')
  .get(getCheaperTours, getAllTours);

router
  .route('/expensive-tours')
  .get(getExpensiveTours, getAllTours);

router
  .route('/stats')
  .get(getTourStats);

router
  .route('/plans/:year')
  .get(getMonthlyPlan);

module.exports = router;
