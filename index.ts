import scrapeIt from 'scrape-it';
import schedule from 'node-schedule';

const url = 'https://www.amazon.co.jp/dp/B07XV8VSZT/'; // Ring Fit

interface AmazonStockData {
    title: string;
    buyboxTextContent: string;
}

const checkStock = async (url: string) => {
    const { data } = await scrapeIt<AmazonStockData>(url, {
        title: 'span#productTitle',
        buyboxTextContent: 'div#buybox',
    });
    return data.buyboxTextContent.includes('カートに入れる');
};

const job = async () => {
    const isInStock = await checkStock(url);
    console.log(isInStock);
};

if (process.env.NODE_ENV === 'develop') {
    (async () => {
        await job();
    })();
} else {
    schedule.scheduleJob('*/10 * * * * *', job); // every 10 seconds
}