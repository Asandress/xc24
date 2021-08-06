import React from 'react'
import { Switch, Route } from "react-router-dom";

import { Index } from './../pages/Index'
import { Convertor } from "./../pages/Convertor";
import { ProjectStack } from '../pages/Projects/ProjectStack';


export const Main = () => {
return(
  <Switch>
    <Route exact path="/" component={Index} />
    <Route path="/convertor" component={Convertor} />
    <Route path="/projects" component={ProjectStack} />
  </Switch>
)

}