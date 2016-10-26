/* eslint-disable no-param-reassign, no-inner-declarations, no-return-assign */

module.exports = (rawArgs, opts = { boolean: [], '--': false }) => {
  // Next two lines are for cases where user supplies either
  // boolean or ['--'], but not both. We don't want the unsupplied
  // one to be undefined, and the default parameter value doesn't
  // kick in because the user supplied an opts hash.
  if (opts.boolean === undefined) opts.boolean = [];
  if (opts['--'] === undefined) opts['--'] = false;

  const args = rawArgs.map(String);
  const argv = {};
  argv._ = [];
  if (opts['--']) argv['--'] = [];

  // Cycle through arguments
  // Use traditional for loop instead of for..in or for..of
  // because in some cases we want to skip an iteration,
  // which we do by incrementing i
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    function setToNextOrTrue(optName) {
      if (opts.boolean.indexOf(optName) > -1) {
        argv[optName] = true;
      } else if (args[i + 1] && !args[i + 1].match(/^-/)) {
        argv[optName] = args[i + 1];
        i += 1;
      } else {
        argv[optName] = true;
      }
    }

    if (arg.match(/^--$/)) {
      if (opts['--']) argv['--'].push(...args.slice(i + 1));
      else argv._.push(...args.slice(i + 1));
      break;
    } else if (arg.match(/^-[^-]+/)) {
      arg.slice(1, -1).split('').forEach(letter => argv[letter] = true);
      const lastLetter = arg.slice(-1);
      setToNextOrTrue(lastLetter);
    } else if (arg.match(/^--[^-]+/)) {
      const optName = arg.slice(2);
      setToNextOrTrue(optName);
    } else {
      argv._.push(arg);
    }
  }

  return argv;
};
