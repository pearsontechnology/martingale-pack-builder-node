module.exports = (ap)=>{
  const argParser = ap.addParser('split', {addHelp: true});

  argParser.addArgument(
    ['-s', '--source', '--source-file'],
    {
      help: 'Name of the source file to process.  Default "pack.yaml"',
      type: 'string',
      dest: 'sourceFilename',
      defaultValue: 'dist/pack.yaml'
    }
  );
  argParser.addArgument(
    ['-d', '--dest', '--dest-file'],
    {
      help: 'Base name of the destination file to provide.  Default "pack.yaml"',
      type: 'string',
      dest: 'destFilename',
      defaultValue: 'pack.yaml'
    }
  );
};
