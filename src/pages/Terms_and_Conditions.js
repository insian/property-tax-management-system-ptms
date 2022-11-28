import React from "react";
import "./Terms.css";

function Terms(){
    document.title = "Terms and Conditions";
    return (
        <div id="terms-main">
            <div className="terms-first">
                <p className="terms-heading">Terms and Conditions</p>
                <ul className="unordered-list">
                    <li className="terms-items">This is a prototype build for Property Tax Management System</li>
                    <li className="terms-items">Rural and Urban Local Body Department is a false Department</li>
                    <li className="terms-items">Any type of illegal payment done through portal will directly be reported to the police</li>
                    <li className="terms-items">If anybody tries to copy the prototype, he/she shall be punished under the Copyright Act</li>
                </ul>
            </div>
        </div>
    );
}

export default Terms;