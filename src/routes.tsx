import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Create from './pages/Point/create';
import Home from './pages/Home';


const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={ Home } path="/" exact/>
            <Route component={ Create } path="/create"/>
        </BrowserRouter>
    )
};

export default Routes;