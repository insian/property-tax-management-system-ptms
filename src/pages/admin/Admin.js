import React from "react";
import "./Admin.css";
import addLb from "../icons/add_lb.png";
import update from "../icons/update.png";
import tax from "../icons/tax.png";
import taxRate from "../icons/tax_rate.png";
import { useNavigate } from "react-router-dom";

function Admin(){
    document.title = "Admin Dashboard";
    const navigate = useNavigate();
    const navigateToAddLb = () => {
        navigate("/add_lb");
    }
    const navigateToUpdateLb = () => {
        navigate("/update_lb");
    }
    const navigateToUpdateTax = () => {
        navigate("/updateTax");
    }

    function onCheckTaxStatus(){
        alert("Sorry this functionality is still under Development");
    }

    return (
        <div id="admin-main">
            <div className="admin-first">
                <div className="admin-second">
                    <button className="admin-btn" onClick={navigateToAddLb}>
                        <span className="admin-icon-row">
                            <img className="admin-icons" src={addLb} alt="admin-png" />
                        </span>
                        <p className="admin-para">Add Local Body</p>
                    </button>
                </div>
                <div className="admin-second">
                    <button className="admin-btn" onClick={navigateToUpdateLb}>
                        <span className="admin-icon-row">
                            <img className="admin-icons" src={update} alt="admin-png" />
                        </span>
                        <p className="admin-para">Update Local Body Details</p>
                    </button>
                </div>
            </div>
            <div className="admin-first">
                <div className="admin-second">
                    <button className="admin-btn" onClick={navigateToUpdateTax}>
                        <span className="admin-icon-row">
                            <img className="admin-icons" src={taxRate} alt="admin-png" />
                        </span>
                        <p className="admin-para">Update Tax Rates</p>
                    </button>
                </div>
                <div className="admin-second">
                    <button className="admin-btn" onClick={onCheckTaxStatus}>
                        <span className="admin-icon-row">
                            <img className="admin-icons" src={tax} alt="admin-png" />
                        </span>
                        <p className="admin-para">Check Tax Status</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Admin;