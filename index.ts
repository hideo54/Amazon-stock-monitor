import scrapeIt from 'scrape-it';
import schedule from 'node-schedule';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
dotenv.config();

const slackChannel = process.env.SLACK_CHANNEL!;
const slackToken = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(slackToken);

const url = 'https://www.amazon.co.jp/dp/B07XV8VSZT/'; // Ring Fit
// const url = 'https://www.amazon.co.jp/dp/B07V3KK93X/'; // Pokemon (for test)

interface AmazonStockData {
    title: string;
    buyboxTextContent: string;
}

const checkStock = async (url: string) => {
    const { data } = await scrapeIt<AmazonStockData>(url, {
        title: 'span#productTitle',
        buyboxTextContent: 'div#buybox',
    });
    return {
        title: data.title,
        isInStock: data.buyboxTextContent.includes('カートに入れる')
    };
};

const job = async () => {
    const { title, isInStock } = await checkStock(url);
    if (isInStock) {
        await webClient.chat.postMessage({
            channel: slackChannel,
            text: `<!channel> Amazon に *${title}* が入荷したよ〜! 今すぐ購入!! ${url}`,
            icon_emoji: ':amazon:',
            username: 'Amazon入荷情報',
        });
    }
};

if (process.env.NODE_ENV === 'develop') {
    (async () => {
        await job();
    })();
} else {
    schedule.scheduleJob('*/10 * * * * *', job); // every 10 seconds
}