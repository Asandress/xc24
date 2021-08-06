import React from 'react'
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Projects } from '.';
import { ProjectItems } from '../ProjectsItems';
import { ProjectAdd } from './add';
import { ProjectCSV } from './ProjectCSV';


export const ProjectStack = () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Projects}/>
      <Route path={`${path}/add`} component={ProjectAdd} />
      <Route path={`${path}/csv/:prjID`} component={ProjectCSV} />
      <Route path={`${path}/:prjID`} component={ProjectItems} />
    </Switch>
  )

}