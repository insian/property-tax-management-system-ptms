import React,{ useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./pay_tax.css";
import { database, publicdb, taxdb } from "../database"
import { onValue, ref , update} from "firebase/database";

function PayTax(){
    document.title = "Pay Tax";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const currentLb = ls_username.substring(2,5);
    const navigate = useNavigate();
    const navigateToPublic = () => {
        navigate("/public");
    }

    const landRef = useRef();
    var rate_array = useRef({
        agri:0,
        resi_o:0,
        resi_h:0,
        inst:0,
        comm:0,
        inds:0,
    });

    useEffect(()=>{
        document.getElementById("ptpid").value = ls_username;
        onValue(ref(database,taxdb+currentState),(snapshot)=> {
            rate_array.current = snapshot.val();
        })
        onValue(ref(database,publicdb+currentState+"/"+currentLb+"/"+ ls_username),(snapshot)=> {
            var data = snapshot.val();
            var tax = parseInt(data.tax_pending);
            if(tax > 0){
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
                document.getElementById("rate").value = parseFloat(rate_array.current[data.landType.value]);
                document.getElementById("tax-pending").value = tax;
                document.getElementById("pt-div").style.display = "block";
            }
            else{
                document.getElementById("no-record").style.display = "block";
            }
        })
    })

    const pay_tax = e => {
        e.preventDefault();
        update(ref(database,publicdb+currentState+"/"+currentLb+"/"+ls_username),{
            last_year: document.getElementById("last_bill").value,
            status: "paid",
            tax_pending: 0,
        })
        alert("Payment Done Successfully");
        navigateToPublic();
    }

    return (
        <div id="lb-main">
            <p className="pt-heading">Pay Tax</p>
            <div className="pt-first-div" id="pt-div">
                <form onSubmit={pay_tax}>
                    <div>
                        <label className="pt-label">PTP ID</label>
                        <input className="pt-input" type="text" placeholder="PTP ID"
                            required="required" disabled={true} id="ptpid" />
                    </div>
                    <div>
                        <label className="pt-label">Last Bill Generated</label>
                        <input className="pt-num-input" type="number" id="last_bill" disabled={true}
                            placeholder="Last Bill Generated" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Last Payment Done</label>
                        <input className="pt-num-input" type="number" id="last_paid" disabled={true}
                            placeholder="Last Payment Done" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Status</label>
                        <input className="pt-num-input" type="text" id="status" disabled={true}
                            placeholder="Status" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Type of Land</label>
                        <Select className="pt-select" isClearable 
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
                        <label className="pt-label">Base Value</label>
                        <input className="pt-num-input" type="number" id="value"
                            placeholder="Value" required="required" disabled={true}/>
                    </div>
                    <div>
                        <label className="pt-label">Area(in square feet)</label>
                        <input className="pt-num-input" type="number" id="area" disabled={true}
                            placeholder="Area" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Number of Floors</label>
                        <input className="pt-num-input" type="number" id="floors" disabled={true}
                            placeholder="Number of Floors" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Tax Rate</label>
                        <input className="pt-num-input" type="number" id="rate" disabled={true}
                            placeholder="Tax Rate" required="required"/>
                    </div>
                    <div>
                        <label className="pt-label">Tax Pending</label>
                        <input className="pt-num-input" type="number" id="tax-pending" disabled={true}
                            placeholder="Tax Pending" required="required"/>
                    </div>
                    <input id="calc" className="lb-buttons pay" type="submit" value="PAY TAX" />
                </form>
            </div>
            <div id="no-record" className="no-records-div">
                <p className="no-record-found">No Bills Found at Present</p>
            </div> 
        </div>
    )
}

export default PayTax;