import express from "express"
import formData from "express-form-data"
import cors from "cors"



import morgan from'morgan'

import fetch from'node-fetch'
import gm from 'gm'
import os from "os"

import dotenv from "dotenv";

import path from 'path';



const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

dotenv.config()


const app = express()

//reader
import converter from 'json-2-csv'
import fs from'fs'
import reader from 'xlsx'
import { Scrabber } from "./app/controllers/scraber.js"

const HOST = process.env.NODE_ENV === 'production' ? process.env.HOST : process.env.DEV_HOST

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.DEV_PORT

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

async function download(url){
  const response = await fetch(url);
  const buffer = await response.buffer();
 

  const promise1 = new Promise((resolve, reject) => {
    fs.writeFile(`./data/img/image.png`, buffer, () => {
    gm("./data/img/image.png").resize(500)
    .write('./data/img/sample_image.jpg', function(err) {
        if(err) console.log(err);
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

app.post('/api/convertr/url', async (req, res) => {

  console.log('body ===>', req.body.url)

  const url = req.body.url

   download(url).then(data => {
    console.log(data)
  //  res.sendFile(data);
    res.json({
      message: 'succsess',
      url:data
    });
    
   })
  
})
//--------------------------
app.post('/api/project/create', (req, res) => {

  console.log('body ===>', req.body)
  console.log('files ===>', req.files.file.path)

  const { path, name } = req.files.file
  console.log(req.files.file)



  const file = reader.readFile(path)

  let data = []

  const sheets = file.SheetNames

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
      data.push(res)
    })
  }

  let date = new Date()
console.log(date)

  const pList = fs.readFileSync('./data/projects/index.json')
  let projectJson = JSON.parse(pList)
  let count = projectJson.length 
  console.log(count)
  let projectID 
  // if(+d[d.length - 1].id + 1)
  if(count === 0 ){
    projectID = 1
  } else {
    projectID = +projectJson[count - 1].id + 1
  }

  projectJson.push({id:projectID, name:req.body.project,status:'blank', date:date})



  fs.writeFile(`./data/projects/index.json`, JSON.stringify(projectJson), function (err) {
    if (err) return console.log(err);
    console.log('project =>',projectJson);
  });



  fs.writeFile(`./data/${projectID}.json`, JSON.stringify(data), function (err) {
    if (err) return console.log(err);
   // console.log(data);
  });

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
        url: `http://localhost:4200/projects/${id}.csv`
      });
    }
  } catch(err) {
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

app.get(`/api/project/scrab/:id`, async (req, res) => {

  const id = req.params.id
  console.log(541034)

  const pList = fs.readFileSync(`./data/${id}.json`)
  let data = JSON.parse(pList)

  
    await Scrabber(id, data).then(done => {
      console.log('done ===> ',done)


      res.json({
        message: done,
      })
    })
    
})




app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});