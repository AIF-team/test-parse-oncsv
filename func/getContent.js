import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { scraping } from './scraping.js'


const LAUNCH_PUPPETEER_OPTS = {
	// headless: false,
	defaultViewport: false,
	userDataDir: './profile/',
	args: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
		'--window-size=1920x1080'
	]
}
const PAGE_PUPPETEER_OPTS = {
	networkIdle2Timeout: 5000,
	waitUntil: 'load',
	timeout: 3000000
}
puppeteer.use(StealthPlugin())


export async function getContent (data) {
	const result = []

	for(const item of data) {

		try {
			console.log(item['URL'])
			const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
			const page = await browser.newPage()
			await page.goto(item['URL'], PAGE_PUPPETEER_OPTS)
			const content = await page.content()
			const errorPage = await page.$('.page__404')
			const propertyBtn = '[data-test="product-characteristics-tab"]'
			await page.waitForSelector(propertyBtn, {timeout: 20000})

			if(!errorPage) {
				await page.click(propertyBtn)
	
				result.push(scraping(content, item))
			} else {
				console.log(`Page 404. Товар ${item['Название']} по ссылки: ${item['URL']}`)
			}

			console.log(result.length)

			await browser.close()
		}
		catch (error) {
			console.log('Error from gunc getContent - ' + item['URL'])
			console.log(error);
		}
	}
	return result
}
