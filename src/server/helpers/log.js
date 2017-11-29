import minilog from 'minilog';

minilog.enable();

const log =
  typeof window !== 'undefined' ? minilog('frontend') : minilog('backend');

if (__DEV__ && __SERVER__) {
  const consoleLog = global.console.log;
  global.console.log = (...args) => {
    if (
      args.length === 1 &&
      typeof args[0] === 'string' &&
      args[0].match(/^\[(HMR|WDS)\]/)
    ) {
      consoleLog(`backend ${args[0]}`);
    } else {
      consoleLog.apply(consoleLog, args);
    }
  };
}

export default log;
