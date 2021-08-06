import React from 'react'
export const DataList = (props) => {

  const data = props.data

  const dataList = () => {
    let header, head

    const rows = data.map((el, ind) => {
      if (ind === 0) head = Object.keys(el).map(ob => ob)
      return <div className="project__item" key={ind}>
        {head.map((elem, index) => <div className="project__name" key={index}>{el[elem]}</div>)}
      </div>
    })

    header = head.map((el, ind) => <div className="project__name" key={ind}>{el}</div>)

    return ({ header, rows })
  }

  const { header, rows } = dataList()

  return (
    <>
      <div className="project__thead">{header}</div>
      <div>{rows}</div>
    </>

  )
}