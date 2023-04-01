import cluster from 'cluster'

import { readFiles, writeFiles } from './func/handlerCsv.js'
import { getContent } from './func/getContent.js'
import { proxyServers } from './func/proxyservers.js'
import { pathDir } from './func/path.js'


const cunccurency = 4
const time = new Date()


if(cluster.isPrimary) {
    for (let i = 0; i < cunccurency; i++) {
        cluster.fork()
    }
} else if (cluster.worker.id === 1) {
    console.time('Start prsing path 1 ...')
    const data = readFiles(pathDir.pathSrc[1])
    const dataParse = await getContent(data, proxyServers[1])
    writeFiles(pathDir.pathBuild[1], dataParse)
    console.timeEnd('Start prsing path 1 ...')
} else if (cluster.worker.id === 2) {
    console.time('Start prsing path 2 ...')
    const data = readFiles(pathDir.pathSrc[2])
    const dataParse = await getContent(data, proxyServers[2])
    writeFiles(pathDir.pathBuild[2], dataParse)
    console.timeEnd('Start prsing path 2 ...')
} else if (cluster.worker.id === 3) {
    console.time('Start prsing path 3 ...')
    const data = readFiles(pathDir.pathSrc[3])
    const dataParse = await getContent(data, proxyServers[3])
    writeFiles(pathDir.pathBuild[3], dataParse)
    console.timeEnd('Start prsing path 3 ...')
} else if (cluster.worker.id === 4) {
    console.time('Start prsing path 4 ...')
    const data = readFiles(pathDir.pathSrc[4])
    const dataParse = await getContent(data, proxyServers[4])
    writeFiles(pathDir.pathBuild[4], dataParse)
    console.timeEnd('Start prsing path 4 ...')
}


