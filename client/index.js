import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.js';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './components/Landing/App';
import Profile from './components/Profile/Profile';
import Marketplace from './components/Marketplace/Marketplace';
import PublicUserProfile from './components/Profile/PublicUserProfile';

require('./assets/styles/app.scss');

export const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  (<Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
      <Route path="/profile" component={Profile} />
      <Route path="/public-user-profile" component={PublicUserProfile} />
      <Route path="/marketplace" component={Marketplace} />
    </Router>
  </Provider>),
  document.getElementById('app')
);
