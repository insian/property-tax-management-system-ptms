import React from "react";
import "./Public.css";
import taxPay from "../icons/tax_pay.png";
import papers from "../icons/papers.png";
import taxRate from "../icons/tax_rate.png";
import calculator from "../icons/calculator.png"
import { useNavigate } from "react-router-dom";

function Public(){
    document.title = "Public Dashboard";
    const navigate = useNavigate();
    const navigateToPayTax = () => {
        navigate("/pay_tax");
    }
    const navigateToViewTax = () => {
        navigate("/view_tax_public");
    }
    const navigateToTaxCalculator = () => {
        navigate("/tax_calculator");
    }
    const navigateToViewPapers = () => {
        alert("This Functionality is still under development");
    }

    return (
        <div id="public-main">
            <div className="public-first">
                <div className="public-second">
                    <button className="public-btn" onClick={navigateToPayTax}>
                        <span className="public-icon-row">
                            <img className="public-icons" src={taxPay} alt="admin-png" />
                        </span>
                        <p className="public-para">Pay Tax</p>
                    </button>
                </div>
                <div className="public-second">
                    <button className="public-btn" onClick={navigateToViewPapers}>
                        <span className="public-icon-row">
                            <img className="public-icons" src={papers} alt="admin-png" />
                        </span>
                        <p className="public-para">View Property Papers</p>
                    </button>
                </div>
            </div>
            <div className="public-first">
                <div className="public-second">
                    <button className="public-btn" onClick={navigateToViewTax}>
                        <span className="public-icon-row">
                            <img className="public-icons" src={taxRate} alt="admin-png" />
                        </span>
                        <p className="public-para">View Tax Rates</p>
                    </button>
                </div>
                <div className="public-second">
                    <button className="public-btn" onClick={navigateToTaxCalculator}>
                        <span className="public-icon-row">
                            <img className="public-icons" src={calculator} alt="admin-png" />
                        </span>
                        <p className="public-para">Tax Calculator</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Public;