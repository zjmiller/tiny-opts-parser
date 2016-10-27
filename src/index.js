/* eslint-disable brace-style, no-inner-declarations, no-return-assign */

module.exports = (rawArgs, rawOpts = {}) => {
  const defaultOpts = {
    boolean: [],
    '--': false,
  };
  const opts = Object.assign({}, defaultOpts, rawOpts);

  const args = rawArgs.map(String);

  // Set up argv, which will eventually be the return value
  const argv = {};
  argv._ = [];
  if (opts['--']) argv['--'] = [];

  // Cycle through arguments
  // Use traditional for loop instead of for..in or for..of
  // because in some cases we want to skip an iteration
  // which we do by incrementing i
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    // This function is nested in for-loop
    // so that it has access to i
    // which it uses to access the next arg
    // and which it increments
    // if next arg is value for optName
    function setToNextOrTrue(optName) {
      // If user specified optName as boolean, set to true
      if (opts.boolean.indexOf(optName) > -1) {
        argv[optName] = true;
      }

      // Else if next arg exists && doesn't start w/ `-`
      // set optName to next arg
      else if (args[i + 1] && !args[i + 1].match(/^-/)) {
        argv[optName] = args[i + 1];
        i += 1;
      }

      // Else, if next arg doesn't exist or starts with `-`
      // set optName to true,
      else {
        argv[optName] = true;
      }
    }

    // If arg is just `--`
    // remainder of args just get pushed to argv._
    // or argv['--'], if specified in parser options
    if (arg.match(/^--$/)) {
      if (opts['--']) argv['--'].push(...args.slice(i + 1));
      else argv._.push(...args.slice(i + 1));
      break;
    }

    // If arg starts w/ `-`
    // this is either one or multiple single-letter opts
    else if (arg.match(/^-[^-]+/)) {
      arg.slice(1, -1).split('').forEach(letter => argv[letter] = true);
      const lastLetter = arg.slice(-1);
      setToNextOrTrue(lastLetter);
    }

    // If arg starts w/ `--`
    // this is one multi-letter option
    else if (arg.match(/^--[^-]+/)) {
      const optName = arg.slice(2);
      setToNextOrTrue(optName);
    }

    // If positional argument, push to argv._
    else {
      argv._.push(arg);
    }
  }

  return argv;
};
