import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import {
  Link,
  useRouteMatch
} from "react-router-dom";



import axios from 'axios'



export const Projects = () => {

  let { path, url } = useRouteMatch();

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [dataLoad, setDataLoad] = useState(false)

  //console.log(path)

  async function getData() {
    if (loading) return
    let data = await axios.get('/api/project/project_list')
    console.log(data.data)
    try{
      setData(data.data.data)
      setDataLoad(true)
      setLoading(false)
    } catch(e) {
      // let data = await axios.get('/api/project/project_list')
      // setData(data.data.data)
      // setDataLoad(true)
      // setLoading(false)
      console.log(e)
    }

    
    
  }

  useEffect(() => {
    setLoading(true)
    console.log('use effect')
    getData()
  }, [])
  useEffect(() => {
    if (data.length < 1) return
  //  console.log('project load ', dataLoad)
    setDataLoad(true)
  }, [data])


  const dataList = () => {
    let rows = []
    //  console.log('project load ', dataLoad)
    data.map((el, ind) => {
      rows.push(<div className="project__item" key={ind} >
        <div className="project__name">{el.name}</div>
        <div className="project__name">{el.status}</div>
        <div className="project__date">{el.date.toString()}</div>
        <Link to={`/projects/${el.id}`}>SHOW</Link>
        <Link to={`/projects/csv/${el.id}`}>CSV</Link>
        <Link to={`/projects/err/${el.id}`}>err</Link>


      </div>)
    })

    return <>{rows}</>
  }


  return (
      <main className="project">
        <div className="project__header">
          <h2>Проекты</h2>
          <Link to={`${url}/add`} className="project_add"><MdAddCircle /> Добавить</Link>
        </div>

        <div className="project__list">
          <div className="project__thead">
            <div className="project__name">Название проекта</div>
            <div className="project__name">Статус</div>
            <div className="project__date">Дата</div>
          </div>
          {dataLoad ? dataList() : null}

        </div>
      </main>

  )
}