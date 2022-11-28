import React,{ useEffect } from "react";
import "./updateTax.css";

import { database, taxdb } from "../database"
import { onValue, ref , update} from "firebase/database";

function UpdateTax(){
    document.title = "Update Tax Rates";
    const currentState = localStorage.getItem("Username");

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

    const onClickUpdate = e => {
        e.preventDefault();
        document.getElementById("agri").disabled = false;
        document.getElementById("resi_o").disabled = false;
        document.getElementById("resi_h").disabled = false;
        document.getElementById("inst").disabled = false;
        document.getElementById("comm").disabled = false;
        document.getElementById("inds").disabled = false;
        document.getElementById("updbtn").style.display = "none";
        document.getElementById("savebtn").style.display = "inline-block";
    }

    const onClickSave = e => {
        e.preventDefault();
        update(ref(database, taxdb+currentState), {
            agri: document.getElementById("agri").value,
            resi_o: document.getElementById("resi_o").value,
            resi_h: document.getElementById("resi_h").value,
            inst: document.getElementById("inst").value,
            comm: document.getElementById("comm").value,
            inds: document.getElementById("inds").value,
        })
        alert("New Tax Rates Saved Successfully");
        window.location.reload();
    }

    return (
        <div id="admin-main">
            <p className="upTax-heading">Update Tax Rates</p>
            <div className="upTax-first-div">
                <form onSubmit={onClickSave}>
                    <div>
                        <label className="upTax-label">Agricultural</label>
                        <input className="upTax-num-input" type="number" placeholder="Agricultural"
                            min="0" max="100" step="0.01" required="required" id="agri" disabled={true} />
                    </div>
                    <div>
                        <label className="upTax-label">Residential (without housing)</label>
                        <input className="upTax-num-input" type="number" placeholder="Residential (without housing)"
                            min="0" max="100" step="0.01" required="required" id="resi_o" disabled={true} />
                    </div>
                    <div>
                        <label className="upTax-label">Residential (with housing)</label>
                        <input className="upTax-num-input" type="number" placeholder="Residential (with housing)"
                            min="0" max="100" step="0.01" required="required" id="resi_h" disabled={true} />
                    </div>
                    <div>
                        <label className="upTax-label">Institutional</label>
                        <input className="upTax-num-input" type="number" placeholder="Institutional"
                            min="0" max="100" step="0.01" required="required" id="inst" disabled={true} />
                    </div>
                    <div>
                        <label className="upTax-label">Commercial</label>
                        <input className="upTax-num-input" type="number" placeholder="Commercial"
                            min="0" max="100" step="0.01" required="required" id="comm" disabled={true} />
                    </div>
                    <div>
                        <label className="upTax-label">Industrial</label>
                        <input className="upTax-num-input" type="number" placeholder="Industrial"
                            min="0" max="100" step="0.01" required="required" id="inds" disabled={true} />
                    </div>
                    <input className="admin-buttons save" type="submit" value="SAVE" id="savebtn"/>
                    <button className="admin-buttons update" onClick={onClickUpdate}
                        id="updbtn" >UPDATE</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateTax;