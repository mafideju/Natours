require('dotenv').config({ path: './config.env' });
require('./logs/logger');
const chalk = require('chalk');
const app = require('./app');

const PORT = process.env.PORT || 7770;

// console.log(process.env.NODE_ENV);

app.listen(PORT, () => {
  console.log(
    chalk.blue(`\n Servidor `)+
    chalk.green(`Express `)+
    chalk.blue(`Rodando `)+
    chalk.red(`@ Porta ${PORT}! \n`
    ));
});
