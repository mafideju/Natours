const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const APIpath = path.join(`${__dirname}`, '..', '/dev-data/data/tours-simple.json');
const tours = JSON.parse(fs.readFileSync(APIpath));


exports.checkId = (req, res, next) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'FAIL',
      message: 'Invalid ID'
    });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Invalid Tour Data'
    });
  }
  next();
}

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

exports.createTour = (req, res) => {
  const newTour = Object.assign({ id: uuid()}, req.body);
  tours.push(newTour);
    
  fs.writeFile(
    `{__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'SUCCESS',
        data: {
          tour: newTour
        }
      })
    }
    );
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
