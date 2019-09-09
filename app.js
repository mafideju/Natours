const express = require('express');
const app = express();
const log = require('./logs/logger');
const PORT = 7769;

app.get('/', (req, res) => {
  res.status(200).send(req.headers['user-agent']);
});

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}!`);
});

log();