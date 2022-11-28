import React,{ useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./bill_page.css";
import { database, publicdb, taxdb } from "../database"
import { onValue, ref , update} from "firebase/database";

function BillPage(){
    document.title = "Genrate Bill";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const currentLb = ls_username.substring(2);
    const navigate = useNavigate();
    const navigateToGenerateBills = () => {
        navigate("/generate_bills");
    }
    
    var rate_array = useRef({
        agri:0,
        resi_o:0,
        resi_h:0,
        inst:0,
        comm:0,
        inds:0,
    });

    const landRef = useRef();
    var data_url = useRef({
        ptpid: "",
        curyear: "",    
    });
    
    useEffect(()=>{
        onValue(ref(database,taxdb+currentState),(snapshot)=> {
            rate_array.current = snapshot.val();
        })
        data_url.current.ptpid = window.location.pathname.split("/")[2];
        data_url.current.curyear = window.location.pathname.split("/")[3];
        document.getElementById("ptpid").value = data_url.current.ptpid;
        onValue(ref(database,publicdb+currentState+"/"+currentLb+"/"+data_url.current.ptpid),(snapshot)=> {
            var data = snapshot.val();
            document.getElementById("name").value = data.name;
            document.getElementById("proploc1").value = data.proploc1;
            document.getElementById("proploc2").value = data.proploc2;
            document.getElementById("last_bill").value = parseInt(data.last_bill_year);
            document.getElementById("last_paid").value = parseInt(data.last_year);
            if(data.status === "paid"){
                document.getElementById("status").value = "Paid till "+ data.last_year;
            }
            else{
                let x = parseInt(data.last_year) + 1;
                document.getElementById("status").value = "Pending from " + x;
            }
            landRef.current.setValue(data.landType);
            document.getElementById("value").value = parseInt(data.value);
            document.getElementById("area").value = parseInt(data.area);
            document.getElementById("floors").value = parseInt(data.floors);
            document.getElementById("rate").value = rate_array.current[data.landType.value];
            document.getElementById("tax-pending").value = parseInt(data.tax_pending);
        })
    })

    const calcTax = e => {
        e.preventDefault();
        var rate = document.getElementById("rate").value;
        var value = document.getElementById("value").value;
        var area = document.getElementById("area").value;
        var floors = document.getElementById("floors").value;
        var year = parseInt(data_url.current.curyear) - parseInt(document.getElementById("last_bill").value);
        var tax = (value * (area/100) * (floors+1) * rate * year)/500000;
        document.getElementById("tax-this-year").value = tax.toFixed(2);
        var t_tax = parseFloat(document.getElementById("tax-pending").value) + parseFloat(tax.toFixed(2));
        document.getElementById("total-tax").value = t_tax.toFixed(2);
        document.getElementById("generate").disabled = false;
    }

    const generate = e => {
        e.preventDefault();        
        update(ref(database,publicdb+currentState+"/"+currentLb+"/"+data_url.current.ptpid),{
            last_bill_year: data_url.current.curyear,
            status: "pending",
            tax_pending: document.getElementById("total-tax").value,
        })
        alert("Bill Generated Successfully");
        navigateToGenerateBills();
    } 

    return (
        <div id="lb-main">
            <p className="bp-heading">Generate Bills Page</p>
            <div className="bp-first-div" id="bp-div">
                <form onSubmit={calcTax}>
                    <div>
                        <label className="bp-label">PTP ID</label>
                        <input className="bp-input" type="text" placeholder="PTP ID"
                            required="required" disabled={true} id="ptpid" />
                    </div>
                    <div>
                        <label className="bp-label">Property Holder Name</label>
                        <input className="bp-input" type="text" placeholder="Property Holder Name"
                            required="required" disabled={true} id="name" />
                    </div>
                    <div>
                        <label className="bp-label">Property Location 1</label>
                        <input className="bp-input" type="text" id="proploc1"
                            disabled={true} placeholder="Property Location 1" required="required" />
                    </div>
                    <div>
                        <label className="bp-label">Property Location 2</label>
                        <input className="bp-input" type="text" id="proploc2"
                            disabled={true} placeholder="Property Location 2" required="required" />
                    </div>
                    <div>
                        <label className="bp-label">Last Bill Generated</label>
                        <input className="bp-num-input" type="number" id="last_bill" disabled={true}
                            placeholder="Last Bill Generated" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Last Payment Done</label>
                        <input className="bp-num-input" type="number" id="last_paid" disabled={true}
                            placeholder="Last Payment Done" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Status</label>
                        <input className="bp-num-input" type="text" id="status" disabled={true}
                            placeholder="Status" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Type of Land</label>
                        <Select className="bp-select" isClearable 
                            isDisabled={true} ref={landRef}
                            placeholder="Type of Land" 
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 5,
                                colors: {
                                    ...theme.colors,
                                    primary: 'black',
                                }
                            })
                            }    
                        />
                    </div>
                    <div>
                        <label className="bp-label">Base Value</label>
                        <input className="bp-num-input" type="number" id="value"
                            placeholder="Value" required="required" disabled={true}/>
                    </div>
                    <div>
                        <label className="bp-label">Area(in square feet)</label>
                        <input className="bp-num-input" type="number" id="area" disabled={true}
                            placeholder="Area" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Number of Floors</label>
                        <input className="bp-num-input" type="number" id="floors" disabled={true}
                            placeholder="Number of Floors" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Tax Rate</label>
                        <input className="bp-num-input" type="number" id="rate" disabled={true}
                            placeholder="Tax Rate" required="required"/>
                    </div>
                    <div>
                        <label className="bp-label">Tax Pending</label>
                        <input className="bp-num-input" type="number" id="tax-pending" disabled={true}
                            placeholder="Tax Pending" required="required"/>
                    </div>
                    <input id="calc" className="lb-buttons update" type="submit" value="CALCULATE" />
                </form>
                <form onSubmit={generate}>
                    <div>
                        <label className="bp-label">Tax for this year</label>
                        <input className="bp-num-input" type="number" id="tax-this-year" disabled={true}
                            placeholder="Tax this year" />
                    </div>
                    <div>
                        <label className="bp-label">Total Tax Payable</label>
                        <input className="bp-num-input" type="number" id="total-tax" disabled={true}
                            placeholder="Total Tax Payable" />
                    </div>
                    <input id="generate" className="lb-buttons generate" type="submit" disabled={true} value="GENERATE BILL"/>
                </form>
            </div>
        </div>

    )
}

export default BillPage;