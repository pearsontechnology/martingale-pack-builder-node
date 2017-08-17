const args = require('../../lib/args');
const Path = require('path');
const fs = require('fs');
const {Docker} = require('rouster');
const async = require('async');
const YAML = require('js-yaml');
const logger = require('../../lib/logger');

const {
  port,
  sourceFilename
} = args;

//args.verbose = true;

const sourceFile = Path.resolve(sourceFilename);
const sourcePath = Path.dirname(sourceFile);
const mpackPath = Path.resolve(__dirname, '../../');

const docker = new Docker({
  image: args.image||'node:latest',
  dockerCommand: args.docker||'docker',
  shell: args.shell||'/bin/bash',
  verbose: (!!args.verbose)||(!!args.loud),
  workingdir: args.workingdir,
  volume: args.volume,
  rm: !args['no-rm'],
  kill: !args['no-kill'],
  containerId: args['container-id'],
  outputStatus: args['output-status'],
  publish: args.publish,
  execute: args.execute
});

const stderr = (err)=>console.error(err);
const stdout = (str)=>console.log(str);
if(args.verbose){
  docker.on('docker_info', (info)=>console.log('docker_info:', info));
  docker.on('error', (err)=>console.error('error:', err));
  docker.on('exec_done', (result)=>console.error('exec_done', result));
  docker.on('killed', (result)=>console.error('killed:', result));
  docker.on('running', (result)=>console.error('running:', result));
  docker.on('spawn', (result)=>console.error('spawn:', result));
}
docker.on('stderr', stderr);
docker.on('stdout', stdout);

const reformCommand = (cmd)=>{
  var res = cmd.match(/"[^"]*"|'[^']*'|[^ \t]+/g);
  return res.map((cmdStr)=>{
    if(cmdStr[0]==='\'' && cmdStr[cmdStr.length-1]==='\''){
      return cmdStr.substr(1, cmdStr.length-2);
    }
    if(cmdStr[0]==='"' && cmdStr[cmdStr.length-1]==='"'){
      return cmdStr.substr(1, cmdStr.length-2);
    }
    return cmdStr;
  });
};

const commands = [
  'cp -R /app/mpack_src/. /app/mpack',
  'rm -rf /app/mpack/node_modules',
  'npm link /app/mpack/',
  'npm test'
];

const executeCommand = (command, index, next)=>{
  const cmd = reformCommand(command);
  console.log('Exec: ', command);
  if(index === commands.length -1){
    docker.exec(cmd);
    return setTimeout(()=>{
      return next();
    }, 1000);
  }
  docker.exec(cmd, (err, output)=>{
    if(err){
      console.error(`Exec ERROR (${err.code}): `, command);
      return next();
    }
    console.log(`Exec SUCCESS (${output.code}): `, command);
    return next();
  });
};

const done = (err)=>{
  if(err){
    console.error(err);
    return process.exit(1);
  }
  return process.exit(0);
};

const start = (err, swagger)=>{
  if(err){
    logger.error(err);
    return process.exit(1);
  }
  const packName = swagger.name.replace(/[ \t]+/g, '-');
  const dockerArgs = [
    args.shell||'/bin/bash',
    '--name', `martingale-${packName}`,
    '-v', `${sourcePath}:/app/pack`,
    '-v', `${mpackPath}:/app/mpack_src`,
    '-p', `${port}:${port}`,
    '-w', '/app/pack',
  ];

  docker.run(...dockerArgs, (err)=>{
    if(err){
      console.error('Docker Error:', err);
      return process.exit(1);
    }
    async.eachOfSeries(commands, executeCommand, done);
  });
};

const loadYaml = ({source, path}, callback)=>{
  return setImmediate(()=>callback(null, YAML.safeLoad(source)));
};

const loadJson = ({source, path}, callback)=>{
  return setImmediate(()=>callback(null, JSON.parse(source)));
};

const loadTypedFile = ({sourceFile, path, handler}, callback)=>{
  fs.readFile(sourceFile, (err, source)=>{
    if(err){
      return callback(err);
    }
    return handler({source, path}, callback);
  });
};

const loadFile = ({sourceFile, path}, callback)=>{
  const ext = Path.extname(sourceFile);
  switch(ext.toLowerCase()){
    case('.yaml'):
      return loadTypedFile({sourceFile, path, handler: loadYaml}, callback);
    case('.json'):
      return loadTypedFile({sourceFile, path, handler: loadJson}, callback);
    default:
      return callback(new Error(`No loader available for file type ${ext}`));
  }
};

loadFile({sourceFile, path: sourcePath}, start);
