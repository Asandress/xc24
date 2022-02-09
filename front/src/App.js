import React, {useEffect} from "react"


import { Header } from "./Components/Header";
import { Main } from "./Components/Main";
import { Sidebar } from "./Components/Sidebar";

import './pages/Index/css/index.css'


function App() {

    // useEffect(() => {
    //     const source = new EventSource(`/api/project/create`);
    
    //     source.addEventListener('open', () => {
    //       console.log('SSE opened!');
    //     });
    
    //     source.addEventListener('message', (e) => {
    //       console.log(e.data);
    //       const data = JSON.parse(e.data);
    
    //       // setDonation(data);
    //     });
    
    //     source.addEventListener('error', (e) => {
    //       console.error('Error: ',  e);
    //     });
    
    //     return () => {
    //       source.close();
    //     };
    //   }, []);
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