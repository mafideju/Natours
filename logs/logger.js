const fs = require('fs');

const log = () => {
  // const date = new Date().toLocaleString();
  // const hour = new Date().toLocaleTimeString();
  return `Accessed at ${new Date().toUTCString()}. \n`;
}

fs.appendFileSync('./logs/log101.txt', log());

module.exports = log;