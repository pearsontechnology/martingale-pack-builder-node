const args = require('../../lib/args');
const Path = require('path');
const fs = require('fs');
const builder = require('../../lib/builder');
const logger = require('../../lib/logger');
const async = require('async');
const mkdirp = require('mkdirp');
const YAML = require('js-yaml');

const {
  sourceFilename,
  destFilename
} = args;

const sourceFile = Path.resolve(sourceFilename);

const destFile = Path.resolve(destFilename);
const destPath = Path.dirname(destFile);

builder({sourceFile}, (err, doc)=>{
  if(err){
    logger.error(err);
    return process.exit(1);
  }

  const {
    pages
  } = doc;

  const pack = Object.keys(doc).reduce((p, key)=>{
    if(key === 'pages'){
      return p;
    }
    p[key] = doc[key];
    return p;
  }, {pages: {}});

  const writePage = (key, next)=>{
    const page = pages[key];
    const yaml = YAML.safeDump(page);

    logger.debug(`Writing: ${destPath}/pages/${key.toLowerCase()}.yaml`);
    fs.writeFile(`${destPath}/pages/${key.toLowerCase()}.yaml`, yaml, (err)=>{
      if(err){
        return next(err);
      }
      pack.pages[key] = {
        $ref: `pages/${key.toLowerCase()}.yaml`
      };
      return next();
    });
  };

  const done = (err)=>{
    if(err){
      logger.error(err);
      return process.exit(1);
    }

    const yaml = YAML.safeDump(pack);
    logger.debug(`Writing: ${destFile}`);
    fs.writeFile(destFile, yaml, (err)=>{
      if(err){
        logger.error(err);
        return process.exit(1);
      }

      logger.info(`Created: ${destFile}`);
    });
  };

  mkdirp(`${destPath}/pages`, (err)=>{
    if(err){
      logger.error(err);
      return process.exit(1);
    }

    async.each(Object.keys(pages), writePage, done);
  });
});
