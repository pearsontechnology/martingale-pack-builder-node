const glob = require('glob');
const pjson = require('../package.json');
const Path = require('path');
const ArgParse = require('argparse').ArgumentParser;
const parser = new ArgParse({
  version: pjson.version,
  addHelp: true,
  description: pjson.description
});

var subparsers = parser.addSubparsers({
  title:'subcommands',
  dest:"subcommand_name"
});

const argFiles = glob.sync(Path.resolve(__dirname, '../commands/**/args.js'));

argFiles.forEach((filename)=>require(filename)(subparsers));

module.exports = parser.parseArgs();
