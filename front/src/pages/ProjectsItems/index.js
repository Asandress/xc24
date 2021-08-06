import React, { useEffect, useState } from 'react'
import { MdAddCircle } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { DataList } from './dataList';




export const ProjectItems = () => {

  const { prjID } = useParams()

  const [data, setDate] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoad, setDataLoad] = useState(false)

  const getData = async () => {
    if (loading) return
    const res = await axios.get(`http://188.166.125.182:4200/api/project/get_project/${prjID}`)
    setDate(res.data.data)
    setDataLoad(true)
    setLoading(false)

  }

  const parse = async () => {
    axios.get(`http://188.166.125.182:4200/api/project/scrab/${prjID}`)
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <main className="project">
      <div className="project__header">
        <h2>{prjID}</h2>
        <div className="project_add" onClick={() => parse()}><MdAddCircle /> Собрать</div>
      </div>
      <div className="project__list">
        {dataLoad ? <DataList data={data} /> : null}
      </div>
    </main>
  )
}