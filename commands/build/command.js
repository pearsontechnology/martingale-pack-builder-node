const ArgParse = require('argparse').ArgumentParser;
const builder = require('../../lib/builder');
const Path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const logger = require('../../lib/logger');
const YAML = require('js-yaml');

const args = require('../../lib/args');

const {
  sourceFilename,
  outputFormat,
  minLogLevel
} = args;

logger.minLevel = logger.levelOf(minLogLevel);

const destFilename = args.destFilename || `dist/pack.${outputFormat}`;

const sourceFile = Path.resolve(sourceFilename);

const destFile = Path.resolve(destFilename);
const destPath = Path.dirname(destFile);

const done = (err)=>{
  if(err){
    logger.error(err);
    process.exit(1);
  }
  logger.info(`Created: ${destFile}`);
};

const writeJson = ({destFile, doc}, callback)=>{
  fs.writeFile(destFile, JSON.stringify(doc, null, 2), (err)=>{
    if(err){
      logger.error(err);
      return process.exit(1);
    }
    return callback();
  });
};

const writeYaml = ({destFile, doc}, callback)=>{
  fs.writeFile(destFile, YAML.safeDump(doc), (err)=>{
    if(err){
      logger.error(err);
      return process.exit(1);
    }
    return callback();
  });
};

logger.info(`Compiling ${sourceFile} to ${destFile}`);

const outputFormatters = {
  json: writeJson,
  yaml: writeYaml
};

const outputFormatter = outputFormatters[outputFormat.toLowerCase()];

if(!outputFormatter){
  logger.error(`Unknown output file format "${outputFormat}"`);
  return process.exit(1);
}

mkdirp(destPath, (err)=>{
  if(err){
    logger.error(err);
    return process.exit(1);
  }
  fs.unlink(destFile, ()=>{
    builder({sourceFile}, (err, doc)=>{
      if(err){
        logger.error(err);
        return process.exit(1);
      }
      outputFormatter({destFile, doc}, done);
    });
  });
});
