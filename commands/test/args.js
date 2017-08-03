module.exports = (ap)=>{
  const argParser = ap.addParser('test', {addHelp: true});

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
      help: 'Port to use.  Default 8080, use 0 to select a random available port.',
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
};
