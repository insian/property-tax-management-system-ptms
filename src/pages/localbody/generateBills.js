import React,{ useRef, useEffect} from "react";

import "./generateBills.css";
import { database, publicdb, taxdb } from "../database"
import { onValue, ref } from "firebase/database";

function GenerateBills(){
    document.title = "Generate Bill";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const currentLb = ls_username.substring(2);
    var rate_array = useRef({
        agri:0,
        resi_o:0,
        resi_h:0,
        inst:0,
        comm:0,
        inds:0,
    });
    var today = new Date();
    var cur_month = useRef({
        min: today.getFullYear() +"-"+ (today.getMonth()+1),
        max : (today.getFullYear()+1) + "-12",
    })

    useEffect (()=>{
        onValue(ref(database,taxdb+currentState),(snapshot)=> {
            rate_array.current = snapshot.val();
        })
    })
    var cur_year=useRef(0);

    const generateBillTable = e => {
        e.preventDefault();
        cur_year.current = document.getElementById("year").value.substring(0,4);
        let tbody = document.getElementById("table-tbody");
        tbody.innerHTML = null;
        onValue(ref(database,publicdb+currentState+"/"+currentLb),(snapshot)=>{
            var data = snapshot.val();
            var keys = Object.keys(snapshot.val());
            for(var item in keys){
                let lyear = data[keys[item]].last_year;
                let bill_year = data[keys[item]].last_bill_year;
                if(bill_year < cur_year.current){
                    let ptpid = keys[item];
                    let name = data[keys[item]].name;
                    let proploc1 = data[keys[item]].proploc1;
                    let proploc2 = data[keys[item]].proploc2;
                    let land = data[keys[item]].landType.label;
                    let value = data[keys[item]].value;
                    let area = data[keys[item]].area;
                    let floors = data[keys[item]].floors;
                    let tax = data[keys[item]].tax_pending;
                    let status = data[keys[item]].status;
                    if(status === "paid"){
                        status = "Paid till "+ lyear;
                    }
                    else{
                        let x = parseInt(lyear) + 1;
                        status = "Pending from " + x;
                    }
                    let path = window.location.protocol + "//" + window.location.host + "/generate_bills/" + ptpid+"/" + cur_year.current + "/";
                    let template = `
                        <tr class="tbody-tr">
                            <td class="tbody-td"><p>${ptpid}</p></td>
                            <td class="tbody-td"><p>${name}</p></td>
                            <td class="tbody-td"><p>${bill_year}</p></td>
                            <td class="tbody-td">
                                <div class="tbody-propdet">
                                    <div class="tbody-row">
                                        <p class="tbody-propdet-plabel">Address</p>
                                        <p>:</p>
                                        <div class="tbody-propdet-pvalue">
                                            <p>${proploc1+", "+proploc2}</p>
                                        </div>
                                    </div>
                                    <div class="tbody-row">
                                        <p class="tbody-propdet-plabel">Land Type</p>
                                        <p>:</p>
                                        <div class="tbody-propdet-pvalue">
                                            <p>${land}</p>
                                        </div>
                                    </div>
                                    <div class="tbody-row">
                                        <p class="tbody-propdet-plabel">Base Value</p>
                                        <p>:</p>
                                        <div class="tbody-propdet-pvalue">
                                            <p>${value}</p>
                                        </div>
                                    </div>
                                    <div class="tbody-row">
                                        <p class="tbody-propdet-plabel">Area</p>
                                        <p>:</p>
                                        <div class="tbody-propdet-pvalue">
                                            <p>${area}</p>
                                        </div>
                                    </div>
                                    <div class="tbody-row">
                                        <p class="tbody-propdet-plabel">Floors</p>
                                        <p>:</p>
                                        <div class="tbody-propdet-pvalue">
                                            <p>${floors}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="tbody-td"><p>${tax}</p></td>
                            <td class="tbody-td"><p>${status}</p></td>
                            <td class="tbody-td">
                                <form action=${path}>
                                    <input class="tbody-buttons" type="submit" value="VIEW"/>
                                </form>
                            </td>
                        </tr>
                    `
                    tbody.innerHTML += template;
                }
            }
            if(tbody.innerHTML === ""){
                document.getElementById("no-record").style.display = "block";
            }
        })
        
    }

    return (
        <div id="lb-main">
            <p className="gb-heading">Generate Tax Bills</p>
            <div className="gb-first-div">
                <form onSubmit={generateBillTable}>
                    <div>
                        <label className="gb-label">Enter Year</label>
                        <input className="gb-input" type="month" placeholder="Enter Tax Year"
                            required="required" id="year" 
                            min={cur_month.current.min} max={cur_month.current.max} />
                        <input className="gb-buttons update" type="submit" value="SUBMIT"/>
                    </div>
                </form>
            </div>
            <div className="gb-second-div" >
                <table className="gb-table" >
                    <thead>
                        <tr>
                            <th className="thead-th thead-ptp"><p>PTP No.</p></th>
                            <th className="thead-th thead-name"><p>Property Holder's Name</p></th>
                            <th className="thead-th thead-ly"><p>Last Bill Year</p></th>
                            <th className="thead-th thead-propdet"><p>Property Details</p></th>
                            <th className="thead-th thead-tax"><p>Tax Pending</p></th>
                            <th className="thead-th thead-status"><p>Status</p></th>
                            <th className="thead-th thead-bill"><p>Generate Bills</p></th>
                        </tr>
                    </thead>
                    <tbody id="table-tbody"></tbody>
                </table>
            </div>
            <div id="no-record" className="no-records-div">
                <p className="no-record-found">No Records Found for the given Year</p>
            </div> 
        </div>
    )
}

export default GenerateBills;