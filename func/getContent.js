import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { scraping } from './scraping.js'


const LAUNCH_PUPPETEER_OPTS = 

const PAGE_PUPPETEER_OPTS = {
	networkIdle2Timeout: 500,
	timeout: 120000
}
puppeteer.use(StealthPlugin())


export async function getContent (data, proxy) {
	const result = []

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: false,
		userDataDir: './profile/',
		args: [
			proxy.url,
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--disable-gpu',
			'--window-size=1920x1080'
		]
	})

	for(const item of data) {
		console.log(item['URL'])
		const page = await browser.newPage()
		await page.authenticate({
			username: proxy.login,
			password: proxy.password,
		})
		try {
			await page.goto(item['URL'] + '#properties', PAGE_PUPPETEER_OPTS)
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
