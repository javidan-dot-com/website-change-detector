const minimist = require('minimist');
const schedule = require('node-schedule');
const botApiHandler = require('node-telegram-bot-api');

const bot = new botApiHandler(process.env.BOT_API_TOKEN);

bot.sendMessage(process.env.TELEGRAM_CHAT_ID, 'Bot is running');

const args = minimist(process.argv.slice(2));
const URL = args['u'];
const seconds = args['s'];
const message = args['m'];
let oldPageContent = undefined;

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

async function checkIfPageHasChanged() {
    let pageContent;

    try {
        pageContent = await fetch(URL).then(res => res.text());
    } catch (error) {
        console.error('Error while fetching the page:', error);
        process.exit(1);
    }

    if (oldPageContent === undefined) {
        oldPageContent = pageContent;
        console.log('Page content is saved');
    } else if (oldPageContent !== pageContent) {
        oldPageContent = pageContent;

        try {
            await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, 'Page content has changed, check the page!');
            console.log('Page content has changed, check the page!');
        } catch (error) {
            console.error('Error while sending message to the chat:', error);
            process.exit(1);
        }
    } else {
        console.log('Page content has not changed');
    };

    console.log('Finished checking page status');
}

schedule.scheduleJob(`*/${seconds} * * * * *`, async () => {
    console.log('Sending message to the URL', URL);
    console.log('Message:', message);

    await checkIfPageHasChanged();
});
