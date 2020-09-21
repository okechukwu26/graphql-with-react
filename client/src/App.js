import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Events from "./pages/Events";
import "./App.css";
import AuthContext from "./context/AuthContext";

export default class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <>
        <Router>
          <React.Fragment>
            <AuthContext.Provider
              value={{
                userId: this.state.userId,
                token: this.state.token,
                login: this.login,
                logout: this.logout,
              }}
            >
              <Navbar />
              <main className="space" />
              <Switch>
                {!this.state.token && (
                  <Redirect from="/booking" to="/auth" exact />
                )}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                <Route path="/events" component={Events} />
                {!this.state.token && <Route path="/auth" component={Auth} />}
                {this.state.token && (
                  <Route path="/booking" component={Booking} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </AuthContext.Provider>
          </React.Fragment>
        </Router>
      </>
    );
  }
}
