import React,{ useEffect } from "react";
import "./viewTax.css";

import { database, taxdb } from "../database"
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

function ViewTaxLB(){
    document.title = "View Tax Rates";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const navigate = useNavigate();
    const navigateToLb = () =>{
        navigate("/rlb_ulb");
    }

    useEffect (()=>{
        onValue(ref(database, taxdb+currentState),(snapshot)=>{
            const data = snapshot.val();
            document.getElementById("agri").value = data.agri;
            document.getElementById("resi_o").value = data.resi_o;
            document.getElementById("resi_h").value = data.resi_h;
            document.getElementById("inst").value = data.inst;
            document.getElementById("comm").value = data.comm;
            document.getElementById("inds").value = data.inds;
        })
    })

    return (
        <div id="lb-main">
            <p className="vTaxLb-heading">Update Tax Rates</p>
            <div className="vTaxLb-first-div">
                <form>
                    <div>
                        <label className="vTaxLb-label">Agricultural</label>
                        <input className="vTaxLb-input" type="number" placeholder="Agricultural"
                            id="agri" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxLb-label">Residential (without housing)</label>
                        <input className="vTaxLb-input" type="number" placeholder="Residential (without housing)"
                            id="resi_o" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxLb-label">Residential (with housing)</label>
                        <input className="vTaxLb-input" type="number" placeholder="Residential (with housing)"
                            id="resi_h" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxLb-label">Institutional</label>
                        <input className="vTaxLb-input" type="number" placeholder="Institutional"
                            id="inst" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxLb-label">Commercial</label>
                        <input className="vTaxLb-input" type="number" placeholder="Commercial"
                            id="comm" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxLb-label">Industrial</label>
                        <input className="vTaxLb-input" type="number" placeholder="Industrial"
                            id="inds" disabled={true} />
                    </div>
                    <button className="lb-buttons update" onClick={navigateToLb}>BACK</button>
                </form>
            </div>
        </div>
    )
}

export default ViewTaxLB;