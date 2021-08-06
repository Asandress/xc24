import React, { useEffect, useState } from 'react'
import axios from 'axios'





export const Test = () => {

  // const [loading, setLoading] = useState(false)

  // const [state, setState] = useState()
  // const [img, setImg] = useState('')


  // const handler = (val) => {
  //   console.log('handlers')
  //   setState(val)
  // }

  // const imgSend = async () => {

  //   console.log('send')

  //   // const HOST = 'http://localhost:4200'

  //   var formData = new FormData();
  //   formData.append('url', state)


  //   try {
  //     const data = await axios.post(`/api/convertr/url`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })

  //     console.log(data)
  //     setImg('http://localhost:4200' + data.data.url)
  //   } catch (error) {
  //     setError(error)
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //     console.log('load')
  // }, [])
  return (

    <main className="project">
      {/* <div className="project__header">
      <h2>Конвертор фотографий</h2>
      
      </div>
      <div className="cv-form">
        <div>
          <label>урл картинки</label>
          <input type="text" name="url" onChange={(e) => handler(e.target.value)} />
        </div>
        <div>
          <button className="cv-form__buttom" onClick={() => console.log('sen')}>Конвертировать</button>
        </div>
      </div>
      <div>
        <img src={img} />
      </div>
      <div>
        <a href={img} download target="_blank">download</a>
      </div> */}
      <button onClick={() => console.log('send')}>SEND</button>
      </main>
    

  )
}