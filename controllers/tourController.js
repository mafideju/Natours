/* eslint-disable no-unused-vars */
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../service/apifeatures');
const catchAsync = require('./../service/catchAsync');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const tours = await features.query;

  res.status(200).json({
    status: 'SUCCESS',
    results: tours.length,
    data: { tours },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'SUCCESS',
    data: { tour },
  });
});

// eslint-disable-next-line no-unused-vars
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'SUCCESS',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'SUCCESS',
    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'SUCCESS',
    data: null,
  });
});

exports.getCheaperTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = 'price';
  req.query.fields = 'name,price';
  next();
};

exports.getExpensiveTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-price';
  req.query.fields = 'name,price';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    {
      $group: {
        // AGRUPAMENTO POR TIPO DE CAMPO
        // _id: null,
        // _id: '$difficulty',
        _id: '$ratingsAverage',
        qtytours: { $sum: 1 },
        qtyRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  res.status(200).json({
    status: 'SUCCESS',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        toursByMonth: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { toursByMonth: -1 },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    status: 'SUCCESS',
    data: { plan },
  });
});
