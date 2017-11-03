const async = require('async');
const YAML = require('js-yaml');
const Path = require('path');
const fs = require('fs');
const logger = require('./logger');

const trueType = (o)=>{
  const type = typeof(o);
  if(type === 'object'){
    if(Array.isArray(o)){
      return 'array';
    }
    if(o instanceof RegExp){
      return 'regex';
    }
    if(o instanceof Date){
      return 'date';
    }
    if(o === null){
      return 'null';
    }
    return type;
  }
  return type;
};

const linkRefs = ({block, path}, callback)=>{
  const type = trueType(block);
  switch(type){
    case('object'):
      const objKeys = Object.keys(block);
      if(block.$ref){
        const sourceFile = Path.join(path, block.$ref);
        return build({sourceFile, path}, (err, doc)=>{
          if(err){
            logger.error(sourceFile, err);
            return callback(err);
          }
          return callback(null, doc);
        });
      }
      if(block.$file){
        const sourceFile = Path.join(path, block.$file);
        logger.info('Linking: ', sourceFile);
        return fs.readFile(sourceFile, (err, doc)=>{
          if(err){
            logger.error(err);
            return callback(err);
          }
          return callback(null, doc.toString());
        });
      }
      return async.reduce(objKeys, {}, (o, key, next)=>{
        const value = block[key];
        return linkRefs({block: value, path}, (err, newValue)=>{
          if(err){
            return next(err);
          }
          return next(null, Object.assign(o, {[key]: newValue}));
        });
      }, (err, arrayData)=>{
        if(err){
          return callback(err);
        }
        return callback(null, arrayData);
      });
    case('array'):
      return async.map(block, (item, next)=>{
        return linkRefs({block: item, path}, next);
      }, (err, arrayData)=>{
        if(err){
          return callback(err);
        }
        return callback(null, arrayData);
      });
    default:
      return setImmediate(()=>callback(null, block));
  }
};

const loadTypedFile = ({sourceFile, path, handler}, callback)=>{
  logger.debug('Loading: ', sourceFile);
  fs.readFile(sourceFile, (err, source)=>{
    if(err){
      return callback(err);
    }
    return handler({source, path}, callback);
  });
};

const loadYaml = ({source, path}, callback)=>{
  try{
    const yaml = YAML.safeLoad(source);
    linkRefs({block: yaml, path}, (err, spec)=>{
      if(err){
        return callback(err);
      }
      return callback(null, spec);
    });
  }catch(e){
    return callback(e);
  }
};

const loadYamlFile = ({sourceFile, path}, callback)=>
    loadTypedFile({sourceFile, path, handler: loadYaml}, callback);

const loadJson = ({source, path}, callback)=>{
  const json = JSON.parse(source);
  linkRefs({block: json, path}, (err, spec)=>{
    if(err){
      return callback(err);
    }
    return callback(null, spec);
  });
};

const loadJsonFile = ({sourceFile, path}, callback)=>
    loadTypedFile({sourceFile, path, handler: loadJson}, callback);

const build = ({source, sourceFile, path}, callback)=>{
  if(typeof(source)==='string'){
    if(!path){
      throw new Error(`No path provided with source.`);
    }
    const isJson = source.trim()[0]==='{';
    if(isJson){
      return loadJson({source, path}, callback);
    }
    return loadYaml({source, path}, callback);
  }
  if(typeof(sourceFile)==='string'){
    const ext = Path.extname(sourceFile);
    if(!path){
      path = Path.dirname(sourceFile);
    }
    switch(ext.toLowerCase()){
      case('.yaml'):
        return loadYamlFile({sourceFile, path}, callback);
      case('.json'):
        return loadJsonFile({sourceFile, path}, callback);
      default:
        return callback(new Error(`No loader available for file type ${ext}`));
    }
  }
  throw new Error('No source or sourceFile provided.');
};

module.exports = build;
