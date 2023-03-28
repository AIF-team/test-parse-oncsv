import fs from 'fs'
import {parse} from 'csv-parse/sync'
import { createObjectCsvWriter } from 'csv-writer'


export function readFiles (dirCsv) {
  const result = []

  fs.readdirSync(dirCsv).forEach(fileName => {
    result.push(
      parse(fs.readFileSync(dirCsv + fileName, 'utf-8'), {delimiter: ';', columns: true})
    )
  })

  return result.flat()
}


export function writeFiles (buildCsv, dataParse) {
  const headers = []
  const headerCsv = []
  const time = new Date()

  dataParse.forEach((el) => {
    headers.push(Object.keys(el))
  })

  const csvHeaderUniq = Array.from(new Set(headers.flat()))
  for (let i = 0; i < csvHeaderUniq.length; i++) {
    const headerCsvObj = {}
    headerCsvObj.id = csvHeaderUniq[i];
    headerCsvObj.title = csvHeaderUniq[i];
    headerCsv.push(headerCsvObj)
  }

  const writerCsv = createObjectCsvWriter({
    path: buildCsv,
    header: headerCsv,
    encoding: 'utf-8',
    fieldDelimiter: ';'
  })

  writerCsv.writeRecords(dataParse)
    .then(() => {
      console.log('...Done');
      console.log('Час: ' + time.getHours() + ', Мин: ' + time.getMinutes())
    })
}