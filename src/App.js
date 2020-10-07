import React, { Fragment, useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar.js";
import "./App.css";
// import UserItem from './components/users/UserItem.js';
import Users from "./components/users/Users";
import axios from "axios";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/pages/About";
import User from "./components/users/User";
import NotFound from "./components/pages/NotFound";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  let githubClientId;
  let githubClientSecret;

  if (process.env.NODE_ENV !== "production") {
    githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
  } else {
    githubClientId = process.env.GITHUB_CLIENT_ID;
    githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  }

  useEffect(async () => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users?client_id=${githubClientId}&CLIENT_SECRET=${githubClientSecret}`
    );

    setLoading(false);
    setUsers(res.data);
  }, []);

  const searchUsers = async (text) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&CLIENT_SECRET=${githubClientSecret}`
    );

    setLoading(false);
    setUsers(res.data.items);
  };

  // get a single github user
  const getUser = async (username) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${githubClientId}&CLIENT_SECRET=${githubClientSecret}`
    );

    setUser(res.data);
    setLoading(false);
  };

  const getUserRepos = async (username) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&CLIENT_SECRET=${githubClientSecret}`
    );
    setRepos(res.data);
    setLoading(false);
  };

  const clearUsers = () => {
    setLoading(false);
    setUsers([]);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });

    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar title="Github Finder" icon="fab fa-github" />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={(props) => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
