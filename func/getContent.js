import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { scraping } from './scraping.js'


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
		userDataDir: proxy.profile,
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
		const page = await browser.newPage()
		await page.authenticate({
			username: proxy.login,
			password: proxy.password,
		})
		try {
			await page.setRequestInterception(true)
			page.on('request', interceptedRequest => {
				if (interceptedRequest.isInterceptResolutionHandled()) return;
				if (
				  interceptedRequest.url().endsWith('.png') ||
				  interceptedRequest.url().endsWith('.jpg') ||
				  interceptedRequest.url().endsWith('.gif') ||
				  interceptedRequest.url().endsWith('.woff2')
				)
				  interceptedRequest.abort();
				else interceptedRequest.continue();
			});

			await page.goto(item['URL'] + '#properties', PAGE_PUPPETEER_OPTS)
			const content = await page.content()
			const errorPage = await page.$('.page__404')

			if(!errorPage) {
				result.push(scraping(content, item))
			} else {
				console.log(`Page 404. Товар ${item['Название']} по ссылки: ${item['URL']}`)
			}

			console.log(result.length)
			console.log(item['URL'])
			console.log(proxy.url)
		}
		catch (error) {
			console.log('Error from gunc getContent - ' + item['URL'])
			console.log(proxy.url)
			console.log(error);
		}
		finally {
			await page.close()
		}
	}
	await browser.close()

	return result
}
