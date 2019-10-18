const express = require('express');

const router = express.Router();
const {
  getCheaperTours,
  getExpensiveTours,
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

router
  .route('/cheaper-tours')
  .get(getCheaperTours, getAllTours);

router
  .route('/expensive-tours')
  .get(getExpensiveTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
