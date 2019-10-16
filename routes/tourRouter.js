const express = require('express');

const router = express.Router();
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
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

module.exports = router;
