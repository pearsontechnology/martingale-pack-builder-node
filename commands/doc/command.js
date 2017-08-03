const args = require('../../lib/args');
const Path = require('path');
const fs = require('fs');
const builder = require('../../lib/builder');
const Handlebars = require('handlebars');
const logger = require('../../lib/logger');

const {
  sourceFilename,
  destFilename,
  templateFilename
} = args;

const sourceFile = Path.resolve(sourceFilename);

const destFile = Path.resolve(destFilename);
const destPath = Path.dirname(destFile);

const templateFile = (templateFilename?fs.readFileSync(templateFilename):fs.readFileSync(Path.resolve(__dirname, 'template.md'))).toString();
const template = Handlebars.compile(templateFile);

builder({sourceFile}, (err, doc)=>{
  if(err){
    logger.error(err);
    return process.exit(1);
  }

  const docs = template({pack: doc});
  fs.writeFile(destFile, docs, (err)=>{
    if(err){
      logger.error(err);
      return process.exit(1);
    }
    logger.info(`Readme generated to: ${destFile}`);
  });
});
