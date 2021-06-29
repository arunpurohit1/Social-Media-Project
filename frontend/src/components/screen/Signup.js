import React,{Component} from "react";
import { Link , Redirect , withRouter ,useHistory } from "react-router-dom";
import M from "materialize-css"
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      password: "",
      dob: "",
    };
  }
 
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { name , username, email,password,dob } = this.state;

    const data = {
      name,
      username ,
      email,
      password,
      dob,
    };

    axios
      .post("http://localhost:3000/api/v2/user/signup", data)
      .then(() => <Redirect to='/login'  /> ,
       M.toast({ html: "Signup Successful" }),
       window.location.replace("/login")  )
      .catch((err) => {
          M.toast({ html: "Signup Failed" })
      });
  };
  render() {
    return (
      <div className="Login">
        <div className="card auth-card">
          <h2>Signup</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="name"
              name="name"
              required
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="username"
              required
              name="username"
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="email"
              required
              name="email"
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="password"
              required
              name="password"
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              required
              name="dob"
              onChange={this.handleInputChange}
            />
            <button className="btn waves-effect waves-light" type="submit">
              Signup
            </button>
            <Link to="/login">
              <h5>Already Have An Account?</h5>
            </Link>
          </form>
        </div>
      </div>
    );
  }
}
 
export default Signup;
 