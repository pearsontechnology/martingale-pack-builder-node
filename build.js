const ArgParse = require('argparse').ArgumentParser;
const builder = require('./lib/builder');
const Path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const pjson = require('./package.json');
const logger = require('./lib/logger');
const YAML = require('js-yaml');

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
  ['-d', '--dest', '--destination', '--destination-file'],
  {
    help: 'Name of the output file. Default "dist/pack.<outputFormat>"',
    dest: 'destFilename',
    type: 'string'
  }
);
argParser.addArgument(
  ['-o', '--outputFormat', '--output-format'],
  {
    help: 'Specifies the output format.  Default "yaml"',
    dest: 'outputFormat',
    type: 'string',
    defaultValue: 'yaml'
  }
);

const args = argParser.parseArgs();

const {
  sourceFilename,
  outputFormat
} = args;
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
  fs.writeFile(destFile, YAML.safeDump(doc, null, 2), (err)=>{
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
