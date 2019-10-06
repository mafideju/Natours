const express = require('express');
const chalk = require('chalk');
const uuid = require('uuid');
const fs = require('fs');
const app = express();
const PORT = 7770;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send(req.rawHeaders);
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    results: tours.length,
    data: { tours }
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(chalk.blue(`\n Servidor `)+chalk.green(`Express `)+chalk.blue(`Rodando `)+chalk.red(`@ Porta ${PORT}! \n`));
});
