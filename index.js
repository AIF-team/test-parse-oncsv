import { readFiles, writeFiles } from "./func/handlerCsv.js"
import { getContent } from "./func/getContent.js"


const dirCsv = './data/'
const buildCsv = './build/petrovich.csv'

const time = new Date()
console.log('Час: ' + time.getHours() + ', Мин: ' + time.getMinutes())


const data = readFiles(dirCsv)
const dataParse = await getContent(data)

writeFiles(buildCsv, dataParse)