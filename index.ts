import scrapeIt from 'scrape-it';

const url = 'https://www.amazon.co.jp/dp/B07XV8VSZT/'; // Ring Fit

interface AmazonStockData {
    title: string;
    buybox: string;
}

const checkStock = async (url: string) => {
    const { data } = await scrapeIt<AmazonStockData>(url, {
        title: 'span#productTitle',
        buybox: 'div#buybox',
    });
    return data.buybox.includes('カートに入れる');
};

(async () => {
    const isInStock = await checkStock(url);
    console.log(isInStock);
})();