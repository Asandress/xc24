import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import {
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";



import axios from 'axios'
import { DataList } from '../ProjectsItems/dataList';



export const ProjectCSV = () => {

  let { path, url } = useRouteMatch();

  const { prjID } = useParams()

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [dataLoad, setDataLoad] = useState(false)

  //console.log(path)
  const [fileURL, setFileURL] = useState('')

  async function getData() {
    if (loading) return
    let data = await axios.get(`http://188.166.125.182:4200/app2/api/project/csv/${prjID}`)
    //console.log(data.data)
    setData(data.data.data)
    setDataLoad(true)
    setLoading(false)
  }

  async function checkFile() {
    let data = await axios.get(`http://188.166.125.182:4200/app2/api/project/csv_check_file/${prjID}`)
    if(data.data.url === '' ) return
    setFileURL(data.data.url)
  }

  useEffect(() => {
    setLoading(true)
    console.log('use effect')
    getData()
    checkFile()
  }, [])
  useEffect(() => {
    if (data.length < 1) return
  //  console.log('project load ', dataLoad)
    setDataLoad(true)
  }, [data])


const getExport = async () => {
  let data = await axios.get(`http://188.166.125.182:4200/app2/api/project/get_csv/${prjID}`)
  console.log(data)
  checkFile()
}

  return (
      <main className="project">
        <div className="project__header">
          <h2>Проекты CSV</h2>
          {fileURL ? <a href={fileURL} download className="project_add"><MdAddCircle /> Скачать CSV</a> : null}
          <div onClick={() => getExport()} className="project_add"><MdAddCircle /> Экспортировать в CSV</div>
        </div>
        <div className="project__list">
      {dataLoad ? <DataList data={data} /> : null}
      </div>
      </main>

  )
}