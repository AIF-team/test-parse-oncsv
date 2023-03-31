import cluster from 'cluster'

import { readFiles, writeFiles } from "./func/handlerCsv.js"
import { getContent } from "./func/getContent.js"
import { proxyServers } from './func/proxyservers.js'


const cunccurency = 2

const dirCsv = './data/'
const dirCsv2 = './data2/'

const buildCsv = './build/petrovich.csv'
const buildCsv2 = './build/petrovich2.csv'

const proxy1 = proxyServers.proxy1
const proxy2 = proxyServers.proxy2



const time = new Date()
console.log('Час: ' + time.getHours() + ', Мин: ' + time.getMinutes())


if(cluster.isPrimary) {
    for (let i = 0; i < cunccurency; i++) {
        cluster.fork()
    }
} else if (cluster.worker.id === 1) {
    const data = readFiles(dirCsv)
    const dataParse = await getContent(data, proxy1)
    writeFiles(buildCsv, dataParse)
} else if (cluster.worker.id === 2) {
    const data = readFiles(dirCsv2)
    const dataParse = await getContent(data, proxy2)
    writeFiles(buildCsv2, dataParse)
}

