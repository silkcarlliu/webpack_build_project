function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

function count(a, b) {
  return a - b
}

export {
  sum,
  count,
}