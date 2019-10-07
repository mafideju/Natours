const chalk = require('chalk');
const app = require('./app');
const logs = require('./logs/logger');

const PORT = 7770;

app.listen(PORT, () => {
  console.log(chalk.blue(`\n Servidor `)+chalk.green(`Express `)+chalk.blue(`Rodando `)+chalk.red(`@ Porta ${PORT}! \n`));
});
