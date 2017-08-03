module.exports = (ap)=>{
  const argParser = ap.addParser('doc', {addHelp: true});

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
      help: 'Base name of the destination file to provide.  Default "readme.md"',
      type: 'string',
      dest: 'destFilename',
      defaultValue: 'readme.md'
    }
  );
  argParser.addArgument(
    ['-t', '--template', '--template-file'],
    {
      help: 'Handlebars template file to process, use internal one if not specified.',
      type: 'string',
      dest: 'templateFilename'
    }
  );
};
