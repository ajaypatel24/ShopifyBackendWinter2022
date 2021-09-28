
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Switch} from 'react-router-dom'
import NewsFeed from './Components/NewsFeed';
import Profile from './Components/Profile'
import LoginPage from './Components/LoginPage';
import UserProfile from './Components/UserProfile'
import PageNotFound from './Components/PageNotFound'
import React from 'react'
export default class App extends React.Component {
  


render() {
  return (


    <div>
      <HashRouter>
        <Switch>
          <Route exact path="/home" component={NewsFeed} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/userprofile/:user" component={UserProfile} />
          <Route exact path="/" component={LoginPage} />
          <Route component={PageNotFound} />
        </Switch>
      </HashRouter>
    </div>
  );
}
}


