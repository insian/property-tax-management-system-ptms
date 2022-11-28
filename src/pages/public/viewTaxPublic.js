import React,{ useEffect } from "react";
import "./viewTaxPublic.css";

import { database, taxdb } from "../database"
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

function ViewTaxPublic(){
    document.title = "View Tax";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const navigate = useNavigate();
    const navigateToPublic = () =>{
        navigate("/public");
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
        <div id="public-main">
            <p className="vTaxPub-heading">Update Tax Rates</p>
            <div className="vTaxPub-first-div">
                <form>
                    <div>
                        <label className="vTaxPub-label">Agricultural</label>
                        <input className="vTaxPub-input" type="number" placeholder="Agricultural"
                            id="agri" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxPub-label">Residential (without housing)</label>
                        <input className="vTaxPub-input" type="number" placeholder="Residential (without housing)"
                            id="resi_o" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxPub-label">Residential (with housing)</label>
                        <input className="vTaxPub-input" type="number" placeholder="Residential (with housing)"
                            id="resi_h" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxPub-label">Institutional</label>
                        <input className="vTaxPub-input" type="number" placeholder="Institutional"
                            id="inst" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxPub-label">Commercial</label>
                        <input className="vTaxPub-input" type="number" placeholder="Commercial"
                            id="comm" disabled={true} />
                    </div>
                    <div>
                        <label className="vTaxPub-label">Industrial</label>
                        <input className="vTaxPub-input" type="number" placeholder="Industrial"
                            id="inds" disabled={true} />
                    </div>
                    <button className="public-buttons update" onClick={navigateToPublic}>BACK</button>
                </form>
            </div>
        </div>
    )
}

export default ViewTaxPublic;