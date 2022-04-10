import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import {
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";



import axios from 'axios'
import { DataList } from '../ProjectsItems/dataList';



export const ProjectERR = () => {

  let { path, url } = useRouteMatch();

  const { prjID } = useParams()

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [dataLoad, setDataLoad] = useState(false)

  //console.log(path)
  const [fileURL, setFileURL] = useState('')

  async function getData() {
    if (loading) return
    let data = await axios.get(`/api/project/err/${prjID}`)
    //console.log(data.data)
    setData(data.data.data)
    setDataLoad(true)
    setLoading(false)
  }


  useEffect(() => {
    setLoading(true)
    console.log('use effect')
    getData()
    // checkFile()
  }, [])
  useEffect(() => {
    if (data.length < 1) return
  //  console.log('project load ', dataLoad)
    setDataLoad(true)
  }, [data])




  return (
      <main className="project">
        <div className="project__header">
          <h2>Errors log</h2>
          
        </div>
        <div className="project__list">
      {dataLoad ? <DataList data={data} /> : null}
      </div>
      </main>

  )
}