module.exports = (ap)=>{
  const argParser = ap.addParser('build', {addHelp: true});

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
