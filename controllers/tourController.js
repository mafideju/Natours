const Tour = require('./../models/tourModel');


exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    results: tours.length,
    data: { tours }
  });
}

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'SUCCESS',
    data: { tour }	  
  })
}

exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'SUCCESS',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err
    })
  }
}

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tour: 'Estamos desenvolvento essa churanha. Dá uma segurada aí.'
    }
  });
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'SUCCESS',
    data: null
  });
}
