import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const token = localStorage.getItem('jwt')

const NavBar = () => {
  const history = useHistory();
  if(token == "" || !token){
    return (
      <nav>
        <div className="nav-wrapper cyan">
          <Link to="/" className="brand-logo center">
            Social Indian
          </Link>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/aboutUs">About Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
  if(token){
    return (
      <nav>
        <div className="nav-wrapper cyan">
          <Link to="/" className="brand-logo center">
            Social Indian
          </Link>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li>
              <Link to="/Profile">Profile</Link>
            </li>
            <li>
              <Link to="/CreatePost">CreatePost</Link>
            </li>
            <li>
              <button className="btn waves-effect waves-light" type="submit" onClick = {() => { localStorage.clear()
                history.push("/login")
                 window.location.reload();
              }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    );
    }
}

export default NavBar