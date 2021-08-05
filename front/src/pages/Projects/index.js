import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

import { ProjectItems } from '../ProjectsItems';
import { ProjectAdd } from './add';

import axios from'axios'



export const Projects = () => {

  const date = new Date().toDateString()

  let { path, url } = useRouteMatch();

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)

  //console.log(path)

  async function getData() {
    if(loading) return 
    let data = await axios.get('/api/project/project_list')
    //console.log(data.data)
    setData(data.data.data)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getData()
  }, [])


const dataList = () => {
  let rows = []
  data.map((el, ind) => {
  rows.push(<Link className="project__item" key={ind} to={`/projects/${el.id}`}>
    <div className="project__name">{el.name}</div>
    <div className="project__name">{el.status}</div>
    <div className="project__date">{el.date.toString()}</div>
  </Link>)
  })

  
  return <>{rows}</>
}


  return(

    <Switch>
    
    <Route exact path={path} >

    
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
        {data ? dataList() :null}
        
      </div>
      </main>
      </Route>
      
      <Route path={`${path}/add`} component={ProjectAdd} />
      <Route path={`${path}/:prjID`} component={ProjectItems} />
    
      </Switch>
      
  )
}