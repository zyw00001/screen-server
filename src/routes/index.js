import React from 'react';
import {HashRouter, Route, Redirect, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import WssApp from './WssAppContainer';
import Home from './HomeContainer';
import Screens from './ScreensContainer';

export default (store, server) => {
  return (
    <Provider store={store}>
      <WssApp server={server}>
        <HashRouter>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/screens' component={Screens}/>
            <Redirect to='/'/>
          </Switch>
        </HashRouter>
      </WssApp>
    </Provider>
  );
};