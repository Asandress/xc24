import express from "express"
import formData from "express-form-data"
import cors from "cors"





import morgan from 'morgan'

import fetch from 'node-fetch'
import gm from 'gm'
import os from "os"

import dotenv from "dotenv";

import path from 'path';



const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

var hostname = 'http://161.35.87.6:4200'

dotenv.config()


const app = express()



//reader
import converter from 'json-2-csv'
import fs from 'fs'
import reader from 'xlsx'
import { Scrabber } from "./app/controllers/scraber.js"

// const HOST = process.env.NODE_ENV === 'production' ? process.env.HOST : process.env.DEV_HOST

// const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.DEV_PORT

const HOST = 'http://localhost'
const PORT = 4200

var corsOptions = {
  origin: `${HOST}:${PORT}`
};

// app.set('Secret', config.secret);

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(cors(corsOptions))

app.use(formData.parse(options));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/_next', express.static(path.join(__dirname, '../elastic/out/_next')))

// const db = require("./app/models")

// db.sequelize.sync();

async function download(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();


  const promise1 = new Promise((resolve, reject) => {
    fs.writeFile(`./data/img/image.png`, buffer, () => {
      gm("./data/img/image.png").resize(500)
        .write('./data/img/sample_image.jpg', function (err) {
          if (err) console.log(err);
          console.log("Jpg to png!")

          // resolve(path.join(__dirname, './data/img/sample_image.jpg'))
          resolve('/data/img/sample_image.jpg')

        });
    })
  })

  return promise1


}
// app.use(express.static(path.join(__dirname, '../public')));
// app.use('/data/img', express.static('/data/img/'));
// app.use('*', express.static('/data/projects/'));
// app.use(express.static('/data/projects/'))
app.use(express.static('data'))

const writeEvent = (res, sseId, data) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req, res, data = '') => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  //  setInterval(() => {
  //    data ? writeEvent(res, sseId, JSON.stringify(data)): ''
  //  }, 300);

 // writeEvent(res, sseId, JSON.stringify(data));
};

app.post('/api/convertr/url', async (req, res) => {

  console.log('body ===>', req.body.url)

  const url = req.body.url

  download(url).then(data => {
    console.log(data)
    //  res.sendFile(data);
    res.json({
      message: 'succsess',
      url: data
    });

  })

})
//--------------------------

app.get('/api/project/create', (req, res) => {

  //console.log('body ===>', req.body)
  //console.log('files ===>', req.files.file.path)

  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res);
  } else {
    res.json({ message: 'Ok' });
  }

})

app.post('/api/project/create', (req, res) => {

  console.log('body ===>', req.body)
  console.log('files ===>', req.files.file.path)

  // if (req.headers.accept === 'text/event-stream') {
  //  // sendEvent(req, res);
  // } else {
  //   res.json({ message: 'Ok' });
  // }

  const { path, name } = req.files.file
  console.log(req.files.file)



  const file = reader.readFile(path)

  let data = []

  const sheets = file.SheetNames

  const limit = 20
  // console.log('length =>',sheets.length )
  // console.log('limit =>',sheets.length / limit)

  let date = new Date()
    //  console.log(date)

      const pList = fs.readFileSync('./data/projects/index.json')
      let projectJson = JSON.parse(pList)
      let count = projectJson.length
     // console.log(count)
      let projectID
      // if(+d[d.length - 1].id + 1)
      if (count === 0) {
        projectID = 1
      } else {
        projectID = +projectJson[count - 1].id + 1
      }


  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
    let rows = Math.ceil(temp.length / limit)

    for (let p = 0; p < rows; p++) {
      // console.log('limit => ', limit * p)
      // console.log('rows =>', 0 + limit * p - limit)
     // console.log('rows ===> ', rows)
      let ii = 0
      let dd = []
      for (let r = 0 + limit * (p + 1) - limit; r < limit * (p + 1); r++) {
//
        if(temp[r] !== undefined) {
         // console.log(temp[r])
         dd[ii] = temp[r] 
        }
        
        ii++
      }
      data[p] = dd


    }

    //console.log('page =>', data)

    data.map((el, ind) => {
    //  console.log('data => ', el)

      //----
      

      projectJson.push({ id: projectID + ind, name: req.body.project + '_' + ind, status: 'blank', date: date })



      



      fs.writeFile(`./data/${projectID + ind}.json`, JSON.stringify(data[ind]), function (err) {
        if (err) return console.log(err);
        // console.log(data);
      });

    })


    // temp.forEach((res) => {
    //   data.push(res)
    // })
  }

  fs.writeFile(`./data/projects/index.json`, JSON.stringify(projectJson), function (err) {
    if (err) return console.log(err);
   // console.log('project =>', projectJson);
  });


  // sendEvent(req, res, 'work done');
  res.json({
    message: 'succsess',
  });
})

app.get('/api/project/project_list', (req, res) => {

  const pList = fs.readFileSync('./data/projects/index.json')
  let projectJson = JSON.parse(pList)

  res.json({
    message: 'succsess',
    data: projectJson
  });
})

app.get(`/api/project/get_project/:id`, (req, res) => {

  const id = req.params.id

  console.log(id)


  const pList = fs.readFileSync(`./data/${id}.json`)
  let projectJson = JSON.parse(pList)

  res.json({
    message: 'succsess',
    data: projectJson
  });
})

app.get(`/api/project/csv/:id`, (req, res) => {

  const id = req.params.id

  console.log(id)


  const pList = fs.readFileSync(`./data/projects/${id}.json`)
  let projectJson = JSON.parse(pList)

  res.json({
    message: 'succsess',
    data: projectJson
  });
})
//csv_check_file
app.get(`/api/project/csv_check_file/:id`, (req, res) => {

  const id = req.params.id

  console.log(id)

  try {
    if (fs.existsSync(`./data/projects/${id}.csv`)) {
      res.json({
        message: 'succsess',
        url: `${hostname}/projects/${id}.csv`
      });
    }
  } catch (err) {
    console.error(err)
    res.json({
      message: 'error',
      url: ''
    });
  }



  res.json({
    message: 'succsess',
    data: projectJson
  });
})

app.get(`/api/project/get_csv/:id`, (req, res) => {

  const id = req.params.id

  console.log(id)


  const pList = fs.readFileSync(`./data/projects/${id}.json`)
  let projectJson = JSON.parse(pList)

  // convert JSON array to CSV string
  converter.json2csv(projectJson, (err, csv) => {
    if (err) {
      throw err;
    }

    // print CSV string
    console.log(csv);

    // write CSV to a file
    fs.writeFileSync(`./data/projects/${id}.csv`, csv);

  });

  res.json({
    message: 'succsess',
    data: projectJson
  });
})

app.get(`/api/project/err/:id`, (req, res) => {

  const id = req.params.id

  console.log(id)


  const pList = fs.readFileSync(`./data/projects/err_${id}.json`)
  let projectJson = JSON.parse(pList)

  

  res.json({
    message: 'succsess',
    data: projectJson
  });
})


app.get(`/api/project/scrab/:id`, async (req, res) => {

  const id = req.params.id
  console.log(541034)

  const pList = fs.readFileSync(`./data/${id}.json`)
  let data = JSON.parse(pList)


  await Scrabber(id, data).then(done => {
    console.log('done ===> ', done)


    res.json({
      message: done,
    })
  })

})




app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});