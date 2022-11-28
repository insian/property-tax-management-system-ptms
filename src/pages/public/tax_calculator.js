import React,{ useRef, useState, useEffect } from "react";
import Select from "react-select";
import "./tax_calculator.css";

import { database, taxdb } from "../database"
import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

function TaxCalculator(){
    document.title = "Tax Calculator";
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const navigate = useNavigate();
    const navigateToPublic = () =>{
        navigate("/public");
    }
    
    const typesOfLand = [
        {label:"Agricultural",value:"agri"},
        {label:"Residential without Housing",value:"resi_o"},
        {label:"Residential with Housing",value:"resi_h"},
        {label:"Institunal",value:"inst"},
        {label:"Commercial",value:"comm"},
        {label:"Industrial",value:"inds"},
    ]

    const errCount = [0,0,0];
    const landRef = useRef();
    const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
    const [landType, setLandType] = useState();
    var data = useRef({
        agri:0,
        resi_o:0,
        resi_h:0,
        inst:0,
        comm:0,
        inds:0,
    });

    useEffect (()=>{
        onValue(ref(database,taxdb+currentState),(snapshot)=> {
            data.current = snapshot.val();
        })
    })

    const checkBaseValue = e => {
        var value = document.getElementById("value").value;
        if(value !== "" && value <= 0){
            document.getElementById("err1").style.display = "block";
            errCount[0]=1;
        }
        else{
            document.getElementById("err1").style.display = "none";
            errCount[0]=0;
        }
    }

    const checkArea = e => {
        var area = document.getElementById("area").value;
        if(area !== "" && area <= 0){
            document.getElementById("err2").style.display = "block";
            errCount[1]=1;
        }
        else{
            document.getElementById("err2").style.display = "none";
            errCount[1]=0;
        }
    }

    const checkFloors = e => {
        var floors = document.getElementById("floors").value;
        if(floors !== "" && floors < 0){
            document.getElementById("err3").style.display = "block";
            errCount[2]=1;
        }
        else{
            document.getElementById("err3").style.display = "none";
            errCount[2]=0;
        }
    }

    function changeLandType(value){
        try{
            setLandType(value);
        }
        catch(e){
            setLandType(null);
        }
    }

    const calcTax = e => {
        e.preventDefault();
        for(var item in errCount){
            if(errCount[item] === 1){
                alert("Please recheck all the errors in the form");
                return;
            }
        }
        if(landType === null){
            alert("Please fill all the dropdown");
            return;
        }

        var rate = data.current[landType.value];
        var value = document.getElementById("value").value;
        var area = document.getElementById("area").value;
        var floors = document.getElementById("floors").value;
        var tax = (value * (area/100) * (floors+1) * rate)/500000;
        document.getElementById("tax_payable").value = tax.toFixed(2);
        document.getElementById("value").disabled = true;
        document.getElementById("area").disabled = true;
        document.getElementById("floors").disabled = true;
        setIsDropdownDisabled(!isDropdownDisabled);
        document.getElementById("tax_payable").disabled = true;
        document.getElementById("calc").disabled = true;
    }

    const resetFeilds = e => {
        document.getElementById("value").value = "";
        document.getElementById("area").value = "";
        document.getElementById("floors").value = "";
        landRef.current.setValue(null);
        document.getElementById("tax_payable").value = 0;
        document.getElementById("value").disabled = false;
        document.getElementById("area").disabled = false;
        document.getElementById("floors").disabled = false;
        setIsDropdownDisabled(!isDropdownDisabled);
        document.getElementById("tax_payable").disabled = false;
        document.getElementById("calc").disabled = false;
    }

    return (
        <div id="public-main">
            <p className="calTax-heading">Tax Calculator</p>
            <div className="calTax-first-div">
                <form onSubmit={calcTax}>
                    <div>
                        <label className="calTax-label">Base Value</label>
                        <input className="calTax-num-input" type="number" id="value"
                            placeholder="Value" required="required" onChange={checkBaseValue}/>
                        <div>
                            <div className="errs" id="err1">
                                <label className="calTax-label"></label>
                                <label className="calTax-error">Base Value Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="calTax-label">Area(in square feet)</label>
                        <input className="calTax-num-input" type="number" id="area"
                            placeholder="Area" required="required" onChange={checkArea}/>
                        <div>
                            <div className="errs" id="err2">
                                <label className="calTax-label"></label>
                                <label className="calTax-error">Area Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="calTax-label">Number of Floors</label>
                        <input className="calTax-num-input" type="number" id="floors"
                            placeholder="Number of Floors" required="required" onChange={checkFloors}/>
                        <div>
                            <div className="errs" id="err3">
                                <label className="calTax-label"></label>
                                <label className="calTax-error">Number of Floors should not be less than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="calTax-label">Type of Land</label>
                        <Select className="calTax-select" options={typesOfLand} isClearable 
                            placeholder="Select Type of Land" onChange={changeLandType} ref={landRef}
                            isDisabled={isDropdownDisabled}
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
                    <input id="calc" className="public-buttons update" type="submit" value="CALCULATE" />
                    <div>
                        <label className="calTax-label">Tax Payable</label>
                        <input className="calTax-num-input" type="number" placeholder="0"
                            id="tax_payable" disabled={true} />
                    </div>
                </form>
                <div>
                    <button id="reset" className="public-buttons update" onClick={resetFeilds} >RESET</button>
                    <button className="public-buttons update" onClick={navigateToPublic} >BACK</button>    
                </div>
            </div>
        </div>
    )
}

export default TaxCalculator;