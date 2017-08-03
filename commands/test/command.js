const Path = require('path');
const logger = require('../../lib/logger');
const builder = require('../../lib/builder');
const YAML = require('js-yaml');

const Hapi = require('hapi');

const args = require('../../lib/args');

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
