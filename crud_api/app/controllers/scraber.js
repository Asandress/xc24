import puppeteer from 'puppeteer'
import fs from 'fs'

import fetch from'node-fetch'
import gm from 'gm'
import os from "os"



let prod = [];
let r = []

// module.exports.run = async (id) => {

  const urlPromise = async (art, data) => new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    console.log(`https://www.labirint.ru/books/${art}/`)
    await page.goto(`https://www.labirint.ru/books/${art}/`, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
    });
    let dataRes = await loadItem(page, art, data).then(res => res)
    resolve(dataRes)

    await browser.close();
    
  })

const getData = async (data) => {
  let arr =[]

  for(let link in data){
    console.log(data[link].Артикул)
    let res = await urlPromise(data[link].Артикул, data[link])
    
    arr.push(res)
  }

  return arr
  // )
}
export const Scrabber = async (id, data) => new Promise(async (resolve, reject) => {

  

  getData(data)
  .then(data => {
    console.log('json ===> ',data)

    fs.writeFile(`./data/projects/${id}.json`, JSON.stringify(data), function (err) {
      if (err) return console.log(err);

    });

    // console.log('d',data)

    resolve('done')
  })
  
})

async function download(url, art, ISBN){
  const response = await fetch(url);
  const buffer = await response.buffer();

 
 

  const promise1 = new Promise((resolve, reject) => {
    fs.writeFile(`./data/img/${ISBN}.png`, buffer, () => {
    gm(`./data/img/${ISBN}.png`).resize(500)
    .write(`./data/img/${ISBN}.jpg`, function(err) {
        if(err) console.log(err);
        console.log("Jpg to png!")
        
        // resolve(path.join(__dirname, './data/img/sample_image.jpg'))
        resolve(`http://localhost:4200/img/${ISBN}.jpg`)
        
    });
  })
})

return promise1
  
    
}


const loadItem = async (page, art, data) => {
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
  dataObj['Variation name'] = `${art} ${await page.$eval('.prodtitle > h1', text => text.textContent)}`
  // Name 1 
  //title
  dataObj['Name 1'] = `Buch: ${art} ${await page.$eval('.prodtitle > h1', text => text.textContent)}`
  // full	Name 2
  //title
  dataObj['full Name 2'] = `${art} ${await page.$eval('.prodtitle > h1', text => text.textContent)}`	
  // Name 3	
  dataObj['Name 3'] = ''

  let text = await page.$eval('#product-about > p', text => text.textContent);

  
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
  ISBN = ISBN.split(':')
  ISBN = ISBN[1].trim()

   let img = await page.$eval('#product-image > img', img => img.src);

   let imgURL = await download(img, art, ISBN)
   
  dataObj['ItemImageUrl'] = imgURL
  // Manufacturer
  let manufacturer = await page.$eval('.publisher', text => text.textContent);
  manufacturer = manufacturer.replace('Издательство: ', '').split(', ')
  dataObj['Manufacturer'] = manufacturer[0]
  
  // Autors
  dataObj['author'] = await page.$eval('.authors > a', text => text.textContent);
  // ISBN
  dataObj['ISBN'] = ISBN
  // Weight

  //dimensions
  let dimensions = await page.$eval('.dimensions', text => text.textContent);
  dimensions = dimensions.replace('Размеры: ', '').replace(' мм', '').split('x')


  // //weigth
  let weight = await page.$eval('.weight', text => text.textContent);
  dataObj['Weight'] = weight.replace('Масса: ', '').replace(' г','')
  // //width
  dataObj['Width'] = dimensions[1]
  //heigth
  dataObj['Hight'] = dimensions[0]
  //length
  dataObj['Leghs'] = dimensions[2]
  
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
  dataObj['Purchase price'] = data['Purche prise (закупка)']
  // Sale
  dataObj['Sale'] = data['Sale prise (цена розница)']
  // Opt
  dataObj['Opt'] = data['Global prise (цена опт)']
  // Year
  dataObj['Year'] = manufacturer[1].replace('. г', '')
  // Stranic
  // //pages
  let pages = await page.$eval('.pages2', text => text.textContent);
  pages = pages.replace('Страниц: ', '')
  dataObj['Stranic'] = pages

 
  
 
  

  //item preview text (300)
  // dataObj['prev_text'] = await page.$eval('.prodtitle > h1', text => text.textContent);
  // //item text
  // dataObj['text'] = await page.$eval('.prodtitle > h1', text => text.textContent);
  // //img
  
  // //author
  
  // //ISBN
  
  
  
  // dataObj['dimensions'] = dimensions
  
  // //year
  
  
  // //Manufacturer
  

 

  return dataObj


}

// module.exports.run();