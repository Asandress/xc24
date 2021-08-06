import React from "react"


import { Header } from "./Components/Header";
import { Main } from "./Components/Main";
import { Sidebar } from "./Components/Sidebar";

import './pages/Index/css/index.css'


function App() {
    console.log('load app')
    return (
        <div className="container">
            <Header />
            <Sidebar />
            <Main />
        </div>

    )
}

export default App