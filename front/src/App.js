import React from "react"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Index } from './pages/Index'

import './pages/Index/css/index.css'
import { Projects } from "./pages/Projects";
import { Convertor } from "./pages/Convertor";

import { FaHome, FaPhotoVideo, FaProjectDiagram } from 'react-icons/fa';
import { ProjectItems } from "./pages/ProjectsItems";


function App() {
    return (
        <Router>
        <div className="container">
            <header>
            <h1>xc24</h1>
            </header>
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

            
            <Route exact path="/" component={Index} />
            <Route  path="/convertor" component={Convertor} />
            <Route  path="/projects" component={Projects} />

            
        </div>
        </Router>
        
    )
}

export default App