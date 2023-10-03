const puppeteer = require('puppeteer');

async function scrapeYouTubeData(videoURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(videoURL);

    console.log('Scraping YouTube data...');

    await browser.close();
}

module.exports = scrapeYouTubeData;
