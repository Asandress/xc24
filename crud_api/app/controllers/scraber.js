import puppeteer from 'puppeteer'
import fs from 'fs'

import fetch from'node-fetch'
import gm from 'gm'
import os from "os"

var hostname = 'http://161.35.87.6';



let prod = [];
let r = []

// module.exports.run = async (id) => {

  const urlPromise = async (art, data) => new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    console.log(`https://www.labirint.ru/books/${art}/`)
    await page.goto(`https://www.labirint.ru/books/${art}/`, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    });
    let dataRes = await loadItem(page, art, data).then(res => res)
    if(dataRes?.error) {
      resolve({
        'error':1,
        'data': dataRes?.error
      })
    }
    else{
      resolve({
          'error':0,
          'data':dataRes
        })
    }
    

    await browser.close();
    
  })

const getData = async (data) => {
  let arr =[]
  let errArr = []

  for(let link in data){
    console.log(data[link].Артикул)
    let res = await urlPromise(data[link].Артикул, data[link])
    if(res?.error === 1) {
      errArr.push({'art':data[link].Артикул,
      'message':res?.data})
    }
    else{
      arr.push(res.data)
    }
    
    
  }

  return ({
    'data':arr,
    'err':errArr})
  // )
}
export const Scrabber = async (id, data) => new Promise(async (resolve, reject) => {

  

  getData(data)
  .then(data => {
    console.log('json ===> ',data.data)

    fs.writeFile(`./data/projects/${id}.json`, JSON.stringify(data.data), function (error) {
      if (error) return console.log(error);

    });
    if(data.err.length > 0 ){
      console.log(data.err)
      fs.writeFile(`./data/projects/err_${id}.json`, JSON.stringify(data.err), function (e) {
        if (e) return console.log(e);
  
      });
    }

    // console.log('d',data)

    resolve('done')
  })
  
})

async function download(url, art, ISBN){
  if(url === '') return ''
  const response = await fetch(url);
  const buffer = await response.buffer();

 
 

  const promise1 = new Promise((resolve, reject) => {
    fs.writeFile(`./data/img/${ISBN}.png`, buffer, () => {
    gm(`./data/img/${ISBN}.png`).resize(500).background("#ffffff")
    .write(`./data/img/${ISBN}.jpg`, function(err) {
        if(err) console.log(err);
        console.log("Jpg to png!")
        
        // resolve(path.join(__dirname, './data/img/sample_image.jpg'))
        resolve(`${hostname}:4200/img/${ISBN}.jpg`)
        
    });
  })
})

return promise1
  
    
}


const loadItem = async (page, art, data) => {
  try {
    
  prod = [];

  await page.waitForSelector('#product');
  // Get the link to all the required books

  let dataObj = {}  

  //Variation Number	
  dataObj['Variation Number'] = `T${art}`
  // External Variation No.	
  dataObj['External Variation No.'] = art
  // CategoryID
  dataObj['CategoryID'] = data['Категория']
  // Variation name	
  //title
  dataObj['Variation name'] = `${await page.$eval('.prodtitle > h1', text => text.textContent)}`
  // Name 1 
  //title
  dataObj['Name 1'] = `Buch: ${await page.$eval('.prodtitle > h1', text => text.textContent)}`
  // full	Name 2
  //title
  dataObj['full Name 2'] = `${await page.$eval('.prodtitle > h1', text => text.textContent)}`	
  // Name 3	
  dataObj['Name 3'] = ''

  // let text = await page.$eval('#product-about > p', text => text.textContent);

  let text = await page.evaluate(() => {
    let element = document.querySelector('#product-about > p')
    if (element) {
      return element.textContent
    } else {
      let element = document.querySelector('#smallannotation > p')
      if (element) {
        return element.textContent
      } 
      return '';
    }

    return '';
  })

  
  // Preview text	
  dataObj['Preview text'] = text.substring(0, 300)
  // Item text
  dataObj['Item text'] = text
  //product-about
  // URL path	
  dataObj['URL path'] = ''
  // Meta description	
  //description
  dataObj['Meta description'] = await page.$eval("head > meta[name='description']", text => text.content);
  // Meta keywords
   //keywords
   dataObj['Meta keywords'] = await page.$eval("head > meta[name='keywords']", text => text.content);
  	
  // ItemImageUrl
  let ISBN = await page.$eval('.product-description .isbn', text => text.textContent);
  console.log(ISBN)
  let ISBN1 = ISBN.split(':')
  let ISBN2 = ISBN1[1].trim()
  let ISBN3 = ISBN2.split(' ')
  console.log(ISBN3)
  let ISBN4 = ISBN3[0].trim()

   let img = await page.evaluate(() => {
    let element = document.querySelector('#product-image > img')
    console.log('ele =>',element)
    if (element) {
      return element.getAttribute('src')
    } else {
      //product-image-schoolkit
      let element = document.querySelector('#product-image > .product-image-schoolkit > img')
      console.log('ele 2 =>',element)
      if (element) {
        return element.getAttribute('src')
      } 
      return '';
    }
    return '';
  })
  //  await page.$eval('#product-image > img', img => img.src);


   let imgURL = img
   
  dataObj['ItemImageUrl'] = await download(imgURL, art, ISBN4) 
  // Manufacturer
  let manufacturer = await page.$eval('.publisher', text => text.textContent);
  manufacturer = manufacturer.replace('Издательство: ', '').split(', ')
  dataObj['Manufacturer'] = manufacturer[0]
  
  // Autors
  dataObj['author'] = await page.evaluate(() => {
    const element = document.querySelector('.authors > a')
    if (element) {
      return element.textContent
    }
    return '';
  })
  
  // await page.$eval('.authors > a', text => text.textContent);
  // ISBN
  dataObj['ISBN'] = ISBN4
  // Weight

  //dimensions
  let dimensions = await page.evaluate(() => {
    const element = document.querySelector('.dimensions')
    if (element) {
      return element.textContent
    }
    return '';
  })
  // await page.$eval('.dimensions', text => text.textContent);
  dimensions = dimensions.replace('Размеры: ', '').replace(' мм', '').split('x')


  // //weigth
  let weight = await page.evaluate(() => {
    const element = document.querySelector('.weight')
    if (element) {
      return element.textContent
    }
    return '';
  })
  // await page.$eval('.weight', text => text.textContent);
  dataObj['Weight'] = weight.replace('Масса: ', '').replace(' г','')
  // //width
  dataObj['Width'] = dimensions[1] ? dimensions[1] : ''
  //heigth
  dataObj['Hight'] = dimensions[0] ? dimensions[0] : ''
  //length
  dataObj['Leghs'] = dimensions[2] ? dimensions[2] : ''
  
  // Suppler
  dataObj['Suppler'] = ''
  // Availability
  dataObj['Availability'] = ''
  // Main warehouse
  dataObj['Main warehouse'] = ''
  // VAT
  dataObj['VAT'] = ''
  // Dimensions Content
  dataObj['Dimensions Content'] = ''
  // Stock
  dataObj['Stock'] = ''
  // Product type
  dataObj['Product type'] = ''
  // Purchase price
  dataObj['Purchase price'] = data['Purche prise (закупка)'].toFixed(2)
  // Sale
  dataObj['Sale'] = data['Sale prise (цена розница)'].toFixed(2)
  // Opt
  dataObj['Opt'] = data['Global prise (цена опт)'].toFixed(2)
  // Year
  dataObj['Year'] = manufacturer[1].replace('. г', '')
  // Stranic
  // //pages
  let pages = await page.evaluate(() => {
    const element = document.querySelector('.pages2')
    if (element) {
      return element.textContent
    }
    return '';
  })

  pages = pages.replace('Страниц: ', '')
  dataObj['Stranic'] = pages

  return dataObj

} catch (error) {
    return {'error': error.message}
}


}

// module.exports.run();