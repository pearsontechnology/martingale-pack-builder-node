const ArgParse = require('argparse').ArgumentParser;
const pjson = require('./package.json');
const Path = require('path');
const logger = require('./lib/logger');
const builder = require('./lib/builder');
const YAML = require('js-yaml');

const Hapi = require('hapi');

const argParser = new ArgParse({
  version: pjson.version,
  addHelp: true,
  description: pjson.description
});
argParser.addArgument(
  ['-s', '--source', '--source-file'],
  {
    help: 'Name of the source file to process.  Default "pack.yaml"',
    type: 'string',
    dest: 'sourceFilename',
    defaultValue: 'pack.yaml'
  }
);
argParser.addArgument(
  ['-d', '--dest', '--dest-file'],
  {
    help: 'Base name of the destination file to provide.  Default "/pack"',
    type: 'string',
    dest: 'destFilename',
    defaultValue: '/pack'
  }
);
argParser.addArgument(
  ['-p', '--port'],
  {
    help: 'Port to use.  Default 8080',
    type: 'int',
    dest: 'port',
    defaultValue: 8080
  }
);
argParser.addArgument(
  ['-c', '--cors'],
  {
    help: 'Sets the Access-Control-Allow-Origin header.  Default *',
    type: 'string',
    dest: 'cors',
    defaultValue: '*'
  }
);
argParser.addArgument(
  ['--host'],
  {
    help: 'Hostname to bind to.  Defaults to system name',
    type: 'string',
    dest: 'host',
  }
);
argParser.addArgument(
  ['-l', '--log', '--log-level'],
  {
    help: 'Minimum log level to show.  Default "debug"',
    type: 'string',
    dest: 'minLogLevel',
    defaultValue: 'debug'
  }
);

const args = argParser.parseArgs();

const {
  sourceFilename,
  destFilename,
  port,
  host,
  cors,
  minLogLevel
} = args;

logger.minLevel = logger.levelOf(minLogLevel);

const cors_origin = cors.split(',').map(c=>c.trim());

const sourceFile = Path.resolve(sourceFilename);

const server = new Hapi.Server();
server.connection({
  port,
  host,
  routes: {
    cors: {
      origin: cors_origin
    }
  }
});

server.route([
  {
    method: 'get',
    path: destFilename+'.json',
    handler(req, reply){
      builder({sourceFile}, (err, doc)=>{
        if(err){
          logger.error(err);
          return reply(err);
        }
        return reply(doc);
      });
    }
  },
  {
    method: 'get',
    path: destFilename+'.yaml',
    handler(req, reply){
      builder({sourceFile}, (err, doc)=>{
        if(err){
          logger.error(err);
          return reply(err);
        }
        return reply(YAML.safeDump(doc));
      });
    }
  }
]);

server.start(err=>{
  if(err){
    throw err;
  }
  logger.info(`Server running at: ${server.info.uri}`);
});
