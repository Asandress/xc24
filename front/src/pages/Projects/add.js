import React, { useState } from 'react'
import { MdAddCircle, MdSend } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import './css/index.css'



export const ProjectAdd = () => {

  const [value, setValue] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [load, setLoad] = useState(false)

  const [err, setError] = useState(false)



  const date = new Date().toDateString()

  const change = (val) => {
    setValue(val)
  }

  const data = (file) => {
    console.log(file.name)
    setSelectedFiles(file)
  }

  const send = async () => {

   // const HOST = 'http://localhost:4200'

    var formData = new FormData();

    formData.append('file', selectedFiles)
    formData.append('project', value)

    let json = {
      'project': value
    }
    try {
      const data = await axios.post(`/api/project/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // const data = await axios({
      //   method: 'post',
      //   url: `/api/project/create?name=test`,
      //   data:{
      //     'data':formData,
      //     'string': JSON.stringify(json, null, 2)
      //   },
      //   //  data: JSON.stringify(json, null, 2),
      //    headers: { "Content-Type": "application/json" } 
      // })
      console.log(data)
    } catch (error) {
      setError(error)
      console.log(error)
    }

   // setLoad(true)
  }
  return (

    <main className="project">
      <div className="project__header">
        <h2>Добавить проект</h2>

      </div>


      {load ?
        <div>загрузка...</div>
        :
        <div className="form">
          <div className="form__input">
            <label>название проекта <span>*</span></label>
            <input name="name" type="text" value={value} onChange={(e) => change(e.target.value)} />
          </div>
          <div className="form__input">
            <label>прикепить файл <span>*</span></label>
            <input name="csv_file" type="file" onChange={(e) => data(e.target.files[0])} />
          </div>
          <div className="form__input">
            <button onClick={() => send()}>Создать</button>
          </div>
        </div>
      }


    </main>
  )
}