const args = require('../../lib/args');
const Path = require('path');
const {Docker} = require('rouster');
const async = require('async');

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

const dockerArgs = [
  args.shell||'/bin/bash',
  '-v', `${sourcePath}:/app/pack`,
  '-v', `${mpackPath}:/app/mpack_src`,
  '-p', `${port}:${port}`,
  '-w', '/app/pack',
];

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

/*
const shutdown = ()=>{
  docker.off('stderr', stderr);
  docker.off('stdout', stdout);
  docker.kill((err, output)=>{
    if(err){
      console.error('Kill Error: ', err);
    }
    console.log('Removing instance');
    return docker.rm(done);
  });
};
*/

docker.run(...dockerArgs, (err)=>{
  if(err){
    console.error('Docker Error:', err);
    return process.exit(1);
  }
  async.eachOfSeries(commands, executeCommand, done);
});
