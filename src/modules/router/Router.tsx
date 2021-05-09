import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import Register from "../register";
import ListUser from "../user";
import NotFound from "../404";

const Router: React.FC<any> = () => {
    return (
        <Switch>
            <Route path={'/register'} exact component={Register}/>
            <Route path={'/home/list-user'} exact component={ListUser}/>
            <Route component={NotFound}/>
        </Switch>
    )
}

export default Router;