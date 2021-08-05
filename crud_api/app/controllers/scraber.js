const puppeteer = require('puppeteer');
const fs = require('fs');



let prod = [];
let r =[]

// module.exports.run = async (id) => {
 exports.Scrabber = async (id, data) => {
  const getData = async () => {
  return Promise.all(data.map( async (el) => {
    const browser = await puppeteer.launch({
      headless: true
  });
    const page = await browser.newPage();
    await page.goto(`https://www.labirint.ru/books/${el.Артикул}/`, {
      waitUntil: 'load',
      // Remove the timeout
      timeout: 0
  });
  let res = await loadItem(page).then(res => res);
  
    await browser.close();
    return res
  })
  )
}

getData().then(data => {

  fs.writeFile(`./data/projects/${id}.json`, JSON.stringify(data), function (err) {
    if (err) return console.log(err);
    
  });

  console.log(data)

  return 'done'
})
};


loadItem = async (page) => {
  prod = [];

  await page.waitForSelector('#product');
        // Get the link to all the required books

        let dataObj = {}
        //title
        dataObj['title'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        //keywords
        dataObj['keywords'] = await page.$eval("head > meta[name='keywords']", text => text.content);
        //description
        dataObj['description'] = await page.$eval("head > meta[name='description']", text => text.content);
        
        //item preview text (300)
        // dataObj['prev_text'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //item text
        // dataObj['text'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //img
        dataObj['img'] = await page.$eval('#product-image > img', img => img.src);
        // //author
        dataObj['author'] = await page.$eval('.authors > a', text => text.textContent);
        // //ISBN
        dataObj['ISBN'] = await page.$eval('.product-description .isbn', text => text.textContent);
        // //weigth
        dataObj['weigth'] = await page.$eval('.weight', text => text.textContent);
        //dimensions
        dataObj['dimensions'] = await page.$eval('.dimensions', text => text.textContent);
        // //width
        // dataObj['width'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //heigth
        // dataObj['heigth'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //length
        // dataObj['length'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //year
        // dataObj['year'] = await page.$eval('.prodtitle > h1', text => text.textContent);
        // //pages
        dataObj['pages'] = await page.$eval('.pages2', text => text.textContent);
        // //Manufacturer
        dataObj['publisher'] = await page.$eval('.publisher', text => text.textContent);


       // console.log(dataObj);

        return dataObj

  
}

// module.exports.run();