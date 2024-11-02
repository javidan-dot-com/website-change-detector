const minimist = require('minimist');

console.log('Project is running', process.env.BOT_API_TOKEN)

const args = minimist(process.argv.slice(2));
const URL = args['u'];
const seconds = args['s'];
const message = args['m'];

console.log(args);
