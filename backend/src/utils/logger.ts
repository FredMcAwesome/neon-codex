// abstract the log functions in case we want to implement a logging library later.
const log = (...params: any[]) => {
  console.log(...params);
};

const error = (...params: any[]) => {
  console.error(...params);
};

export { log, error };
