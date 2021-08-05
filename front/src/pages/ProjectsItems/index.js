import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import axios from 'axios'




export const ProjectItems = () => {

  const {prjID} = useParams()

  const [data, setDate] = useState([])
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    if(loading) return 
    const res = await axios.get(`/api/project/get_project/${prjID}`)
    console.log(res.data.data)
    setDate(res.data.data)
    setLoading(false)


  }

  const parse = async () => {
    axios.post(`/api/project/scrab/${prjID}`)
  }
  

  useEffect(() => {
    console.log('pr ==>',prjID)
    getData()
  }, [])

  const dataList = () => {
    let rows = []

    data.map((el, ind) => {
      rows.push(<div className="project__item" key={ind}>
      <div className="project__name">{el.Артикул}</div>
      <div className="project__name">{el.Категория}</div>
      <div className="project__name">{el.Название}</div>
    </div>)
    
    })

    return <>{rows}</>
  }



  
  return(
    
    <main className="project">
      <div className="project__header">
      <h2>{prjID}</h2>
      <div className="project_add"><MdAddCircle /> Собрать</div>
      </div>
      
      <div className="project__list">
        <div className="project__thead">
          <div className="project__name">ID</div>
          <div className="project__name">Категория</div>
          <div className="project__name">Название</div>
        </div>

        {data.length > 0 ? dataList(): null}
        
      </div>
    </main>
   
  )
}