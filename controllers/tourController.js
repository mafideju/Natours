const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // FILTER I
    const queryObj = { ...req.query };
    ['page', 'sort', 'limit', 'fields'].forEach((el) => delete queryObj[el]);
    // FILTER II
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(get|gt|lt|lte)\b/g, (query) => `$${query}`);

    const query = Tour.find(JSON.parse(queryStr));
    const tours = await query;

    res.status(200).json({
      status: 'SUCCESS',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'SUCCESS',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'SUCCESS',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'SUCCESS',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'SUCCESS',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};
