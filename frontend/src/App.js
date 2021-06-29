import React,{useEffect ,createContext , useReducer} from 'react';
import NavBar from './components/Navbar';
import "../src/App.css"
import {BrowserRouter , Route, Switch, useHistory} from "react-router-dom"
import Home from "../src/components/screen/Home"
import Login from "../src/components/screen/Login";
import Signup from "../src/components/screen/Signup";
import AboutUs from './components/screen/AboutUs';
import Profile from './components/screen/profile';
import CreatePost from './components/screen/CreatePost';
import {reducer , initialState} from "./reducer/userReducer"

export const UserContext = createContext()
const token = localStorage.getItem("jwt");


const Routing = () => {
    if(token == "" || !token){
      
    return (
      <Switch>
        <Route path="/Login">
          <Login />
        </Route>
        <Route path="/Signup">
          <Signup />
        </Route>
        <Route path="/AboutUs">
          <AboutUs />
        </Route>
      </Switch>
    );
    }
   else{
     return (
       <Switch>
         <Route exact path="/">
           <Home />
         </Route>
         
         <Route path="/Profile">
           <Profile />
         </Route>
         <Route path="/CreatePost">
           <CreatePost />
         </Route>
       </Switch>
     );
   }
  
}





function App() {
  const [state, dispatch] = useReducer(reducer , initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}


export default App;

