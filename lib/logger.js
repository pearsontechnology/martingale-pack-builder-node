const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;
const FATAL = 60;

const levelFromName = {
    'trace': TRACE,
    'debug': DEBUG,
    'info': INFO,
    'warn': WARN,
    'error': ERROR,
    'fatal': FATAL
};
const nameFromLevel = Object.keys(levelFromName).reduce((nameFromLevel, name)=>{
  nameFromLevel[levelFromName[name]] = name;
  return nameFromLevel;
}, {});

const levelOf = (level)=>{
  const levelName = nameFromLevel[level] || level;
  const levelValue = levelFromName[levelName] || INFO;
  return levelValue;
};

const log = (level, ...args)=>{
  const levelName = nameFromLevel[level] || level;
  const levelValue = levelFromName[levelName] || INFO;
  if(levelValue < logger.minLevel){
    return;
  }
  (levelValue>=WARN?console.error:console.log)(new Date().toISOString(), `${levelName.toUpperCase()}(${levelValue}):`, ...args);
};

const logger = Object.keys(levelFromName).reduce((logger, name)=>{
  const level = levelFromName[name];
  logger[name] = (...args)=>log(level, ...args);
  return logger;
}, {logLevels: Object.keys(levelFromName), minLevel: DEBUG, levelOf});

module.exports = logger;
