import React from 'react'
import { Link } from "react-router-dom";

import { FaHome, FaPhotoVideo, FaProjectDiagram } from 'react-icons/fa';


export const Sidebar = () => {
  return (

    <div className="sidebar">
      <ul>
        <li>
          <Link to="/"><FaHome />На главную</Link>
        </li>
        <li>
          <Link to="/convertor">
            <FaPhotoVideo />Конвертация картинок</Link>
        </li>
        <li>
          <Link to="/projects">
            <FaProjectDiagram />
            CSV проекты</Link>
        </li>
      </ul>
    </div>

  )
}