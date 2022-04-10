import React from 'react'
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Projects } from '.';
import { ProjectItems } from '../ProjectsItems';
import { ProjectAdd } from './add';
import { ProjectCSV } from './ProjectCSV';
import { ProjectERR } from './ProjectERR';


export const ProjectStack = () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      
      <Route path={`${path}/add`} component={ProjectAdd} />
      <Route path={`${path}/csv/:prjID`} component={ProjectCSV} />
      <Route path={`${path}/err/:prjID`} component={ProjectERR} />
      <Route path={`${path}/:prjID`} component={ProjectItems} />
      <Route exact path={path} component={Projects}/>
    </Switch>
  )

}