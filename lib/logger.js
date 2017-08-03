const logger = {
  info(...args){
    console.log('INFO: ', ...args);
  },
  debug(...args){
    console.log('DEBUG:', ...args);
  },
  error(...args){
    console.error('ERROR:',...args);
  }
};

module.exports = logger;
