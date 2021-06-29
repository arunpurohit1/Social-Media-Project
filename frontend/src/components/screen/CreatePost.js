import React, { Component } from "react";
import M from "materialize-css";
import axios from "axios";


class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      name: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const {title , body , name } = this.state;

    const data = {
      title,
      body,
      name,
    };

    axios
      .post("http://localhost:3000/api/v2/user/postContent", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        () => M.toast({ html: "Post Created" }),
        window.location.replace("/")
      )
      .catch((err) => {
        M.toast({ html: "Post Creation Failed" });
      });
  };
  render() {
    return (
      <div
        className="card input-filled"
        style={{
          margin: "10px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="title" name = "title" onChange= {this.handleInputChange} />
          <input type="text" placeholder="body" name = "body" onChange= {this.handleInputChange} />
          <input type="text" placeholder="name" name = "name" onChange= {this.handleInputChange} />
          <button className="btn waves-effect waves-light" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}
 
export default CreatePost;

