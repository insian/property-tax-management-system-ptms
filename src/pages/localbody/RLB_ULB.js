import React from "react";
import "./RLB_ULB.css";
import addPublic from "../icons/add_public.png";
import update from "../icons/update.png";
import taxRate from "../icons/tax_rate.png";
import genBill from "../icons/generate_bill.png"

import {useNavigate} from "react-router-dom";

function RLB_ULB(){
    document.title = "Local Body Dashboard";
    const navigate = useNavigate();
    const navigateToAddPtp = () => {
        navigate("/add_ptp");
    }
    const navigateToUpdatePtp = () => {
        navigate("/update_ptp");
    }
    const navigateToViewTax = () => {
        navigate("/view_tax_lb");
    }
    const navigateToGenerateBills = () => {
        navigate("/generate_bills");
    }

    return (
        <div id="lb-main">
            <div className="lb-first">
                <div className="lb-second">
                    <button className="lb-btn" onClick={navigateToAddPtp}>
                        <span className="lb-icon-row">
                            <img className="lb-icons" src={addPublic} alt="admin-png" />
                        </span>
                        <p className="lb-para">Add Public Account</p>
                    </button>
                </div>
                <div className="lb-second">
                    <button className="lb-btn" onClick={navigateToUpdatePtp}>
                        <span className="lb-icon-row">
                            <img className="lb-icons" src={update} alt="admin-png" />
                        </span>
                        <p className="lb-para">Update Public Account</p>
                    </button>
                </div>
            </div>
            <div className="lb-first">
                <div className="lb-second">
                    <button className="lb-btn" onClick={navigateToViewTax}>
                        <span className="lb-icon-row">
                            <img className="lb-icons" src={taxRate} alt="admin-png" />
                        </span>
                        <p className="lb-para">View Tax Rates</p>
                    </button>
                </div>
                <div className="lb-second">
                    <button className="lb-btn" onClick={navigateToGenerateBills}>
                        <span className="lb-icon-row">
                            <img className="lb-icons" src={genBill} alt="admin-png" />
                        </span>
                        <p className="lb-para">Generate Tax Bills</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RLB_ULB;