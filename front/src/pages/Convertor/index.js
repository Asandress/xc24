import React, { useState } from 'react'
import axios from 'axios'

import './css/index.css'



export const Convertor = () => {

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState()
  const [img, setImg] = useState('')
  const handler = (val) => {
    console.log('handlers')
    setState(val)
  }

  const send = async () => {

    console.log('send')

    // const HOST = 'http://localhost:4200'
 
     var formData = new FormData();
     formData.append('url', state)
 
     
     try {
       const data = await axios.post(`/api/convertr/url`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data'
         }
       })
      
       console.log(data)
       setImg('http://localhost:4200' + data.data.url)
     } catch (error) {
       setError(error)
       console.log(error)
     }
    }
  return(
    
    <main>
      <h1>Конвертор фотографий</h1>
      <div className="cv-form">
        <div>
          <label>урл картинки</label>
          <input type="text" name="url" onChange={(e) => handler(e.target.value)}/>
        </div>
        <div>
          <div className="cv-form__buttom" onClick={() => send()}>Конвертировать</div>
        </div>
      </div>
      <div>
        <img src={img} />
      </div>
      <div>
        <a href={img} download target="_blank">download</a>
      </div>
    </main>
   
  )
}