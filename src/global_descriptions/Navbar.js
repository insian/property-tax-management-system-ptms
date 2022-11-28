import './Navbar.css';
import logo from "./logo.png";
import logout from "./logout.png"
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  function onLogOut() {
    localStorage.setItem("adminLoggedIn", "false");
    localStorage.setItem("lbLoggedIn","false");
    localStorage.setItem("publicLoggedIn", "false");
    localStorage.removeItem("Username");
    navigate("/");
  }
  
  function HOME() {
    if(localStorage.getItem("adminLoggedIn") === "true") {
      navigate("/admin");
    }
    else if(localStorage.getItem("lbLoggedIn") === "true"){
      navigate("/rlb_ulb");
    }
    else if(localStorage.getItem("publicLoggedIn") === "true"){
      navigate("/public");
    }
    else {
      navigate("/");
    }
  }

  function onViewProfile(){
    alert("Sorry this functionality is still under Development");
  }

  const ViewProfileButton = () => {
    if((localStorage.getItem("adminLoggedIn") === "true") 
      || (localStorage.getItem("lbLoggedIn") === "true") 
      || (localStorage.getItem("publicLoggedIn") === "true")) {
        return (
          <div>
            <button className="vp-btn" 
              onClick={onViewProfile}>View Profile</button>
          </div>    
        );
    }
    else {
      return (<></>);
    }
  }

  const LogOutButton = () => {
    if((localStorage.getItem("adminLoggedIn") === "true") 
      || (localStorage.getItem("lbLoggedIn") === "true") 
      || (localStorage.getItem("publicLoggedIn") === "true")) {
        return (
          <button className="logout-btn"onClick={onLogOut}>
            <img className="logout-img" src={logout} alt=""/>
            <p className="logout-para">Logout</p>
          </button>);
    }
    else {
      return (<></>);
    }
  }

  return (
    <div className="Navbar">
      <span className="row">
          <button className="logo-btn" onClick={HOME}>
            <img className="logo" src={logo} alt="logo-png" />
          </button>
      </span>
      <h1>Online Property Tax Information and Management System</h1>
      <span className='vp'>
        <ViewProfileButton />
      </span>
      <span className="logout">
        <LogOutButton />
      </span>
    </div>
  );
}

export default Navbar;
