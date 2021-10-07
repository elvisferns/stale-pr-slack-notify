import colors from 'colors/safe.js';
const { red, setTheme } = colors;
 
// set single property
var error = red;
error('this is red');
 
// set theme
setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

export default colors;

// console.error(error('this is red'));

// export * from 'colors/safe.js';
