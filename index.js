const minimist = require('minimist');
const schedule = require('node-schedule');

console.log('Project is running', process.env.BOT_API_TOKEN)

const args = minimist(process.argv.slice(2));
const URL = args['u'];
const seconds = args['s'];
const message = args['m'];

console.log(args);

function verifyTerminalInputs() {
  if (isNaN(seconds)) {
    console.error('Seconds should be a number');
    process.exit(1);
  } else if (seconds < 1) {
    console.error('Seconds should be greater than 0');
    process.exit(1);
  } else if (!URL.includes('https://') && !URL.includes('http://')) {
    console.error('URL should be a valid URL');
    process.exit(1);
  } else if (typeof message !== 'string' || message.trim() === '') {
    console.error('Message should be string type and not be empty');
    process.exit(1);
  } else {
    console.log('All terminal inputs are valid');
  }
}

verifyTerminalInputs();

schedule.scheduleJob(`*/${seconds} * * * * *`, function () {
    console.log('Sending message to the URL', URL);
    console.log('Message:', message);
});
