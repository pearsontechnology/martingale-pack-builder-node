#! /usr/bin/env node

const args = require('../lib/args');

const {
  subcommand_name: commandName
} = args;

require(`../commands/${commandName}/command`);
