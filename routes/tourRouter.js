const express = require('express');
const router = express.Router();
const {
  checkId,
  checkBody,
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour
} = require('../controller/tourController');

router.param('id', checkId);

router
  .route('/')
  .get(getAllTours)
  .post(checkBody, createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;