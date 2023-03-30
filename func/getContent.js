import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { scraping } from './scraping.js'


const LAUNCH_PUPPETEER_OPTS = {
	// headless: false,
	defaultViewport: false,
	userDataDir: './profile/',
	args: [
		'--proxy-server=176.124.46.105:8000',
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
		'--window-size=1920x1080'
	]
}
const PAGE_PUPPETEER_OPTS = {
	networkIdle2Timeout: 500,
	timeout: 120000
}
puppeteer.use(StealthPlugin())


export async function getContent (data) {
	const result = []
	const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)

	for(const item of data) {
		console.log(item['URL'])
		const page = await browser.newPage()
		await page.authenticate({
			username: '9UQHhE',
			password: 'uT0VW5',
		})
		try {
			await page.goto(item['URL'] + '#properties', PAGE_PUPPETEER_OPTS)
			await page.screenshot({path: 'myip.png'})
			const content = await page.content()
			const errorPage = await page.$('.page__404')

			if(!errorPage) {
				result.push(scraping(content, item))
			} else {
				console.log(`Page 404. Товар ${item['Название']} по ссылки: ${item['URL']}`)
			}

			console.log(result.length)
		}
		catch (error) {
			console.log('Error from gunc getContent - ' + item['URL'])
			console.log(error);
		}
		finally {
			await page.close()
		}
	}
	await browser.close()

	return result
}
