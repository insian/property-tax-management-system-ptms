import './Footer.css';
import { useNavigate } from "react-router-dom";


function Footer() {
  const navigate = useNavigate();
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
  const navigateToTerms = () => {
    navigate("/terms_and_conditions");
  }

  const navigateToContact = () => {
    navigate("/contact_us");
  }

  return (
    <div className="Footer">
      <span >
        <p className="first-para">
          <button className="footer-buttons" onClick={HOME}>Home</button>|
          <button className="footer-buttons" onClick={navigateToTerms}>Terms and Conditions</button>|
          <button className="footer-buttons" onClick={navigateToContact}>Contact Us</button>
        </p>
        <p className="second-para">
          Maintained by "Rural and Urban Local Body Department"
        </p>
      </span>
    </div>
  );
}

export default Footer;
