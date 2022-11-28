import React,{ useEffect, useRef, useState } from "react";
import Select from "react-select";

import "./add_ptp.css";
import { Popup } from "../popup";
import { database, lbdb, publicdb} from "../database"
import { onValue, ref , set, update} from "firebase/database";
import { useNavigate } from "react-router-dom";

function AddPtp(){
    document.title = "Add Property Tax Payer Details";
    const navigate = useNavigate();
    const navigateToLb = () => {
        navigate('/rlb_ulb');
    }
    const [isAddSuccess, setIsAddSucess] = useState(false);
    const toggleAddSucess = () => {
        setIsAddSucess(!isAddSuccess);
    }

    const nameRef = useRef();
    const dobRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const proploc1Ref = useRef();
    const proploc2Ref = useRef();
    const dateRef = useRef();
    const valueRef = useRef();
    const areaRef = useRef();
    const floorsRef = useRef();
    const passRef = useRef();
    const typesOfLand = [
        {label:"Agricultural",value:"agri"},
        {label:"Residential without Housing",value:"resi_o"},
        {label:"Residential with Housing",value:"resi_h"},
        {label:"Institunal",value:"inst"},
        {label:"Commercial",value:"comm"},
        {label:"Industrial",value:"inds"},
    ]
    const gender_array = [
        {label:"Male",value:"male"},
        {label:"Female",value:"female"},
        {label:"Others",value:"others"},
    ]

    const [gender, setGender] = useState();
    const [landType, setLandType] = useState();
    var errCount = [0,0,0,0,0];
    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const currentLb = ls_username.substring(2);
    
    const [data_ptp, setData_ptp]=  useState();
    const [data_actual_ptp,setData_actual_ptp]= useState();
    var no_ptp;
    var actual_ptp;
    var ptp_id;
    const [ptp,setPTP] = useState("");
    var curdate = useRef({
        today: "",
    })

    useEffect(() => {
        onValue(ref(database,lbdb+currentState+"/"+currentLb),(snapshot) => {
            setData_ptp(snapshot.val().nptp);
            setData_actual_ptp(snapshot.val().actual_ptp);
        })
        var today = new Date();
        curdate.current.today = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    })


    const checkPhone = e => {
        if((phoneRef.current.value.length > 0) && (phoneRef.current.value.length < 10)){
            document.getElementById("lerr1").innerText = "Phone No. should have 10 digits";
            document.getElementById("err1").style.display = "block";
            errCount[0]=1;
        }
        else{
            document.getElementById("err1").style.display = "none";
            errCount[0]=0;
        }
        if((phoneRef.current.value.length > 0) && (!phoneRef.current.value.match(/^[0-9]+$/))){
            document.getElementById("lerr2").innerText = "All characters should be digits";
            document.getElementById("err2").style.display = "block";
            errCount[1]=1;
        }
        else{
            document.getElementById("err2").style.display = "none";
            errCount[1]=0;
        }
    }

    const checkBaseValue = e => {
        if(valueRef.current.value !== "" && valueRef.current.value <= 0){
            document.getElementById("err3").style.display = "block";
            errCount[2]=1;
        }
        else{
            document.getElementById("err3").style.display = "none";
            errCount[2]=0;
        }
    }

    const checkArea = e => {
        if(areaRef.current.value !== "" && areaRef.current.value <= 0){
            document.getElementById("err4").style.display = "block";
            errCount[3]=1;
        }
        else{
            document.getElementById("err4").style.display = "none";
            errCount[3]=0;
        }
    }

    const checkFloors = e => {
        if(floorsRef.current.value !== "" && floorsRef.current.value < 0){
            document.getElementById("err5").style.display = "block";
            errCount[4]=1;
        }
        else{
            document.getElementById("err5").style.display = "none";
            errCount[4]=0;
        }
    }

    function changeGender(value){
        try{
            setGender(value);
        }
        catch(e){
            setGender(null);
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

    const onAddPtp = e => {
        e.preventDefault();
        for(var item in errCount){
            if(errCount[item] === 1){
                alert("Please recheck all the errors in the form");
                return;
            }
        }
        if(landType === null || gender === null){
            alert("Please fill all the dropdown");
            return;
        }
        no_ptp = data_ptp;
        actual_ptp = data_actual_ptp;
        update(ref(database,lbdb+currentState+"/"+currentLb),{
            nptp: no_ptp+1,
            actual_ptp: actual_ptp+1,
        })
        no_ptp = no_ptp + 1;
        ptp_id = ls_username+no_ptp;
        setPTP(ptp_id);
        set(ref(database,publicdb+currentState+"/"+currentLb+"/"+ptp_id),{
            name: nameRef.current.value,
            dob: dobRef.current.value,
            gender: gender,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            proploc1: proploc1Ref.current.value,
            proploc2: proploc2Ref.current.value,
            landType: landType,
            doa: dateRef.current.value,
            value: valueRef.current.value,
            area: areaRef.current.value,
            floors: floorsRef.current.value,
            password: passRef.current.value,
            last_year: dateRef.current.value.substring(0,4),
            last_bill_year: dateRef.current.value.substring(0,4),
            status: "paid",
            tax_pending: 0,
        })
        toggleAddSucess();
    }

    return (
        <div id="lb-main">
            <p className="addptp-heading">Add Property Tax Payer</p>
            <div className="addptp-first-div">
                <form onSubmit={onAddPtp}>
                    <div>
                        <label className="addptp-label">Property Holder Name</label>
                        <input className="addptp-input" type="text" placeholder="Property Holder Name"
                            required="required" ref={nameRef} />
                    </div>
                    <div>
                        <label className="addptp-label">Date of Birth</label>
                        <input className="addptp-input" type="date" placeholder="Property Holder Name"
                            required="required" ref={dobRef} max={curdate.current.today}/>
                    </div>
                    <div>
                        <label className="addptp-label">Gender</label>
                        <Select className="addptp-select" options={gender_array} isClearable 
                            placeholder="Select Gender" onChange={changeGender}
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
                        <label className="addptp-label">Phone No</label>
                        <input className="addptp-input" type="text" onChange={checkPhone} 
                            maxLength={10} ref={phoneRef} placeholder="Phone No" required="required" />
                        <div>
                            <div className="errs" id="err1">
                                <label className="addptp-label"></label>
                                <label className="addptp-error" id="lerr1">error</label>
                            </div>
                        </div>
                        <div>
                            <div className="errs" id="err2">
                                <label className="addptp-label"></label>
                                <label className="addptp-error" id="lerr2">error</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addptp-label">Email ID</label>
                        <input className="addptp-input" type="text" ref={emailRef}
                            placeholder="Email ID" required="required" />
                    </div>
                    <div>
                        <label className="addptp-label">Property Location 1</label>
                        <input className="addptp-input" type="text" ref={proploc1Ref}
                            placeholder="Property Location 1" required="required" />
                    </div>
                    <div>
                        <label className="addptp-label">Property Location 2</label>
                        <input className="addptp-input" type="text" ref={proploc2Ref}
                            placeholder="Property Location 2" required="required" />
                    </div>
                    <div>
                        <label className="addptp-label">Type of Land</label>
                        <Select className="addptp-select" options={typesOfLand} isClearable 
                            placeholder="Select Type of Land" onChange={changeLandType}
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
                        <label className="addptp-label">Date of Acquisition</label>
                        <input className="addptp-input" type="date" placeholder="Date of Acquisition" 
                            maxLength={3} ref={dateRef} required="required" max={curdate.current.today} />
                    </div>
                    <div>
                        <label className="addptp-label">Base Value</label>
                        <input className="addptp-num-input" type="number" ref={valueRef}
                            placeholder="Value" required="required" onChange={checkBaseValue}/>
                        <div>
                            <div className="errs" id="err3">
                                <label className="addptp-label"></label>
                                <label className="addptp-error">Base Value Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addptp-label">Area(in square feet)</label>
                        <input className="addptp-num-input" type="number" ref={areaRef}
                            placeholder="Area" required="required" onChange={checkArea}/>
                        <div>
                            <div className="errs" id="err4">
                                <label className="addptp-label"></label>
                                <label className="addptp-error">Area Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addptp-label">Number of Floors</label>
                        <input className="addptp-num-input" type="number" ref={floorsRef}
                            placeholder="Number of Floors" required="required" onChange={checkFloors}/>
                        <div>
                            <div className="errs" id="err5">
                                <label className="addptp-label"></label>
                                <label className="addptp-error">Number of Floors should not be less than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addptp-label">Property Papers</label>
                        <input className="addptp-input" type="file" disabled={true}/>
                    </div>
                    <div>
                        <label className="addptp-label">Password</label>
                        <input className="addptp-input" type="password" ref={passRef}
                            placeholder="Password" required="required" />
                    </div>
                    <input className="lb-buttons add" type="submit" value="ADD" />
                    <button className="lb-buttons cancel" onClick={navigateToLb}>CANCEL</button>
                </form>
            </div>
            <div>
                {isAddSuccess && <Popup 
                    handleClose = {navigateToLb}
                    content = {
                        <div>
                            <p className="add-success">Sucessfully Added Property Tax Paper Details</p>
                            <p className="add-success">PTP ID   : {ptp}</p>
                            <p className="add-success">Password : {passRef.current.value}</p>
                            <button className="ok-button" onClick={navigateToLb}>OK</button> 
                        </div>
                    }
                />
                }
            </div>
        </div>
    )
}

export default AddPtp;