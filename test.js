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

const args = argParser.parseArgs();

const {
  sourceFilename
} = args;

const sourceFile = Path.resolve(sourceFilename);

const server = new Hapi.Server();
server.connection({
  port: 8081,
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

server.route([
  {
    method: 'get',
    path: '/pack.json',
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
    path: '/pack.yaml',
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
