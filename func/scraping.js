import cherio from 'cherio'


export function scraping (content, item) {

  const dataWrite = {}
  const $ = cherio.load(content, {decodeEntities: false})
  const productCard = $('.product-content')
  let units

  if(productCard.find('div.units > span > p.unit-tab')) {
    units = productCard.find('div.units > span > p.unit-tab').text()
  } else {
    units = productCard.find('div.units > span > span:nth-child(2) > span').text()
  }


  switch (units) {
    case 'погонный метр':
      units = 1
      break;
    case 'мешок':
      units = 6
      break;
    case 'лист':
      units = 7
      break;
    case 'упаковку':
      units = 8
      break;
    case 'м2':
      units = 9
      break;
    case 'рулон':
      units = 10
      break;
    default:
      // Шт. по умолчанию
      units = 5
  }

  dataWrite['Ссылка'] = item['URL']
  dataWrite['Название'] = item['Название']
  dataWrite['Цена'] = productCard.find('[data-test="product-retail-price"]').clone().children().remove().end().text()

  if(dataWrite['Цена'] == null) {
    dataWrite['Цена'] = productCard.find('[data-test="product-gold-price"]').clone().children().remove().end().text()
  }

  dataWrite['Валюта'] = 'RUB'
  dataWrite['Единицы-измерения'] = units
  dataWrite['Описание'] = productCard.find('div:nth-child(1) > div > div.pt-col-xl-7 > div > div > div').html()
  dataWrite['Изображения-файлы'] = item['Изображения-файлы']
  dataWrite['Код-товара'] = productCard.find('[data-test="product-code"]').text()

  const charKey = productCard.find('div:nth-child(3) > div > div.pt-row > div > ul > li > .title')
  const charValue = productCard.find('div:nth-child(3) > div > div.pt-row > div > ul > li > .value')
  
  for (let i = 0; i < charKey.length; i++) {
    const key = charKey.eq(i).text()
    const value = charValue.eq(i).text()
    dataWrite[key] = value
  }

  const category = productCard.find('.pt-breadcrumb___XncqQ > a > span')
  for (let i = 1; i < category.length; i++) {
    dataWrite[`Раздел-${i}`] = category.eq(i).text()
  }

  return dataWrite
}