const path = require('path');
const tsConfigPaths = require("tsconfig-paths");
const prompt = require('prompt');
const yargs = require('yargs');

const confirmAction = (cmd) => {
  console.log(`PROD commands require confirmation. Please type "${cmd}" to confirm.`);
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['confirm'], function(err, result) {
      if (err || result.confirm !== cmd) {
        return reject();
      }
      resolve();
    });
  });
};

const environments = {
  production: 'production.env',
  development: 'local.env',
};

module.exports = yargs
  .command('$0 <cmd>', 'Run Command', () => {
  }, async (argv) => {

    const env = process.env.NODE_ENV || 'development';

    if (env === 'production') {
      try {
        await confirmAction(argv.cmd);
      } catch (e) {
        console.log('Could not confirm action');
        return;
      }
    }

    console.log(`Bootstrapping cmd "${argv.cmd}"`);

    require('dotenv').config({
      path: path.resolve(process.cwd(), '.env', environments[env]),
    });

    const cleanup = tsConfigPaths.register({
      baseUrl: "./",
      paths: require('../tsconfig.json').compilerOptions.paths
    });

    require('ts-node').register({
      project: 'tsconfig.json',
    });

    await require('./command.ts')(argv.cmd);

    console.log(`\n\nFinished cmd "${argv.cmd}"`);

    cleanup();

    process.exit(0);
  })
  .help()
  .argv;

