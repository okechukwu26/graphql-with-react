import React, { Component } from "react";
import "./auth.css";
import AuthContext from "../context/AuthContext";

export default class Auth extends Component {
  static contextType = AuthContext;
  state = {
    isLogin: true,
    error: {},
  };
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }
  switchHandle = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.email.current.value,
      password = this.password.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody;
    requestBody = {
      query: `
      query loginUser ($email:String!, $password:String!) {
        login(email:$email, password:$password){
          userId
          token
          tokenExpiration
        }
      }`,
      variables: {
        email,
        password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation CreateUser($email:String!, $password:String!) {
          createUser(userInput: {email:$email, password:$password}){
            _id
            email
          }
        }
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res);
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        } else {
          console.log(resData);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.email} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Pasword</label>
          <input type="password" id="password" ref={this.password} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchHandle}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}
