import React, { Component , useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const {email, password} = this.state;

    const data = {
      email,
      password,
    };

    axios
      .post("http://localhost:3000/api/v2/user/login", data)
      .then(
        (response) => localStorage.setItem("jwt", response.data.token),
        M.toast({ html: "Login Successful Need To Refresh For The Home Page" }),
        
      ).then(() => 
        window.location.replace("/CreatePost")
      )
      .catch((err) => {
        M.toast({ html: "Login Failed" });
      });
  };
  render() {
    return (
      <div className="Login">
        <div className="card auth-card">
          <h2>Login</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="email"
              required
              name = "email"
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="password"
              required
              name = "password"
              onChange={this.handleInputChange}
            />
            <button className="btn waves-effect waves-light" type="submit">
              login
            </button>
            <Link to="/signup">
              <h5>Don't Have An Account ?</h5>
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
