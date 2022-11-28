import React,{ useRef, useState, useEffect} from "react";
import Select from "react-select";

import "./update_ptp.css";
import { database, lbdb, publicdb } from "../database"
import { onValue, ref , update, remove} from "firebase/database";
import { Popup } from "../popup";

function UpdatePTP(){
    document.title = "Update Property Tax Payer Details";
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
    const toggleDeletePopup = e => {
        e.preventDefault();
        setIsDeleteOpen(!isDeleteOpen);
    }

    const ls_username = localStorage.getItem("Username");
    const currentState = ls_username.substring(0,2);
    const currentLb = ls_username.substring(2);
    var errCount = [0,0,0,0,0];
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
    const landRef = useRef();
    const genRef = useRef();
    const ptpRef = useRef();
    const [selected, setSelected] = useState("");
    const [data_actual_ptp,setData_actual_ptp] = useState();
    var actual_ptp;

    const makeOptions = () => {
        var ptp_array=[];
        if(currentState !== "")
            onValue(ref(database,publicdb+currentState+"/"+currentLb),(snapshot)=>{
                try{
                    const data = Object.keys(snapshot.val());
                    for ( var item in data)
                        ptp_array.push({
                            label: data[item],
                            value: data[item],
                        })
                }
                catch(e){
                    console.log("");
                }
            })
        return ptp_array;
    }

    var curdate = useRef({
        today: "",
    })

    useEffect(() => {
        onValue(ref(database,lbdb+currentState+"/"+currentLb),(snapshot) => {
            setData_actual_ptp(snapshot.val().actual_ptp);
        })
        var today = new Date();
        curdate.current.today = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    })

    
    function onSelectPtp(value){
        try{
            var select = value.value;
            setSelected(select);
            onValue(ref(database,publicdb+currentState+"/"+currentLb+"/"+select), (snapshot)=>{
                try{
                    document.getElementById("name").value = snapshot.val().name;
                    document.getElementById("dob").value = snapshot.val().dob;
                    document.getElementById("phone").value = snapshot.val().phone;
                    document.getElementById("email").value = snapshot.val().email;
                    document.getElementById("proploc1").value = snapshot.val().proploc1;
                    document.getElementById("proploc2").value = snapshot.val().proploc2;
                    document.getElementById("date").value = snapshot.val().doa;
                    document.getElementById("value").value = snapshot.val().value;
                    document.getElementById("area").value = snapshot.val().area;
                    document.getElementById("floors").value = snapshot.val().floors;
                    genRef.current.setValue(snapshot.val().gender);
                    landRef.current.setValue(snapshot.val().landType);
                    setGender(snapshot.val().gender);
                    setLandType(snapshot.val().landType);
                }
                catch(e){
                    console.log("");
                }
            });
        }
        catch(e){
            console.log("");
        }
        document.getElementById("updptp-div").style.display = "block";
    }

    const checkPhone = e => {
        var phone = document.getElementById("phone").value;
        if((phone.length > 0) && (phone.length < 10)){
            document.getElementById("lerr1").innerText = "Phone No. should have 10 digits";
            document.getElementById("err1").style.display = "block";
            errCount[0]=1;
        }
        else{
            document.getElementById("err1").style.display = "none";
            errCount[0]=0;
        }
        if((phone.length > 0) && (!phone.match(/^[0-9]+$/))){
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
        var value = document.getElementById("value").value;
        if(value !== "" && value <= 0){
            document.getElementById("err3").style.display = "block";
            errCount[2]=1;
        }
        else{
            document.getElementById("err3").style.display = "none";
            errCount[2]=0;
        }
    }

    const checkArea = e => {
        var area = document.getElementById("area").value;
        if(area !== "" && area <= 0){
            document.getElementById("err4").style.display = "block";
            errCount[3]=1;
        }
        else{
            document.getElementById("err4").style.display = "none";
            errCount[3]=0;
        }
    }

    const checkFloors = e => {
        var floors = document.getElementById("floors").value;
        if(floors !== "" && floors < 0){
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

    const onClickUpdate = e => {
        e.preventDefault();
        document.getElementById("name").disabled = false;
        document.getElementById("dob").disabled = false;
        document.getElementById("phone").disabled = false;
        document.getElementById("email").disabled = false;
        document.getElementById("proploc1").disabled = false;
        document.getElementById("proploc2").disabled = false;
        document.getElementById("date").disabled = false;
        document.getElementById("value").disabled = false;
        document.getElementById("area").disabled = false;
        document.getElementById("floors").disabled = false;
        document.getElementById("updbtn").style.display = "none";
        document.getElementById("savebtn").style.display = "inline-block";
        document.getElementById("delbtn").style.display = "none";
        setIsDropdownDisabled(!isDropdownDisabled);
    }

    const onClickSave = e => {
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
        update(ref(database,publicdb+currentState+"/"+currentLb+"/"+selected),{
            name: document.getElementById("name").value,
            dob: document.getElementById("dob").value,
            gender: gender,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            proploc1: document.getElementById("proploc1").value,
            proploc2: document.getElementById("proploc2").value,
            landType: landType,
            doa: document.getElementById("date").value,
            value: document.getElementById("value").value,
            area: document.getElementById("area").value,
            floors: document.getElementById("floors").value,
            last_year: document.getElementById("date").value.substring(0,4),
            last_bill_year: document.getElementById("date").value.substring(0,4),
            status: "paid",
            tax_pending: 0,
        })
        window.location.reload();
        alert("Successfully updated the details");
    }

    const onClickDelete = e => {
        e.preventDefault();
        remove(ref(database,publicdb+currentState+"/"+currentLb+"/"+selected));
        actual_ptp = data_actual_ptp;
        update(ref(database,lbdb+currentState+"/"+currentLb),{
            actual_ptp: actual_ptp-1,
        })
        alert("Successfully deleted the local body details");
        window.location.reload();
    }

    return (
        <div id="lb-main">
            <p className="updptp-heading">Update Property Tax Payers Details</p>
            <Select className="updptp-select-main" options={makeOptions()} isClearable ref={ptpRef}
                 id="dropdown" isDisabled={isDropdownDisabled} onChange={onSelectPtp}/>
            <div className="updptp-first-div" id="updptp-div">
                <form onSubmit={onClickSave}>
                    <div>
                        <label className="updptp-label">Property Holder Name</label>
                        <input className="updptp-input" type="text" placeholder="Property Holder Name"
                            required="required" disabled={true} id="name" />
                    </div>
                    <div>
                        <label className="updptp-label">Date of Birth</label>
                        <input className="updptp-input" type="date" placeholder="Property Holder Name"
                            required="required" disabled={true} id="dob" max={curdate.current.today}/>
                    </div>
                    <div>
                        <label className="updptp-label">Gender</label>
                        <Select className="updptp-select" options={gender_array} isClearable 
                            onChange={changeGender} 
                            isDisabled={!isDropdownDisabled} ref={genRef}
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
                        <label className="updptp-label">Phone No</label>
                        <input className="updptp-input" type="text" onChange={checkPhone} 
                            maxLength={10} disabled={true} id="phone" 
                            placeholder="Phone No" required="required" />
                        <div>
                            <div className="errs" id="err1">
                                <label className="updptp-label"></label>
                                <label className="updptp-error" id="lerr1">error</label>
                            </div>
                        </div>
                        <div>
                            <div className="errs" id="err2">
                                <label className="updptp-label"></label>
                                <label className="updptp-error" id="lerr2">error</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="updptp-label">Email ID</label>
                        <input className="updptp-input" type="text" id="email"
                            disabled={true} placeholder="Email ID" required="required" />
                    </div>
                    <div>
                        <label className="updptp-label">Property Location 1</label>
                        <input className="updptp-input" type="text" id="proploc1"
                            disabled={true} placeholder="Property Location 1" required="required" />
                    </div>
                    <div>
                        <label className="updptp-label">Property Location 2</label>
                        <input className="updptp-input" type="text" id="proploc2"
                            disabled={true} placeholder="Property Location 2" required="required" />
                    </div>
                    <div>
                        <label className="updptp-label">Type of Land</label>
                        <Select className="updptp-select" options={typesOfLand} isClearable 
                            isDisabled={!isDropdownDisabled} ref={landRef}
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
                        <label className="updptp-label">Date of Acquisition</label>
                        <input className="updptp-input" type="date" placeholder="Date of Acquisition" 
                            maxLength={3} id="date" required="required" disabled={true} max={curdate.current.today}/>
                    </div>
                    <div>
                        <label className="updptp-label">Base Value</label>
                        <input className="updptp-num-input" type="number" id="value"
                            placeholder="Value" required="required" 
                            disabled={true} onChange={checkBaseValue}/>
                        <div>
                            <div className="errs" id="err3">
                                <label className="updptp-label"></label>
                                <label className="updptp-error">Base Value Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="updptp-label">Area(in square feet)</label>
                        <input className="updptp-num-input" type="number" id="area" disabled={true}
                            placeholder="Area" required="required" onChange={checkArea}/>
                        <div>
                            <div className="errs" id="err4">
                                <label className="updptp-label"></label>
                                <label className="updptp-error">Area Should be greater than Zero</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="updptp-label">Number of Floors</label>
                        <input className="updptp-num-input" type="number" id="floors" disabled={true}
                            placeholder="Number of Floors" required="required" onChange={checkFloors}/>
                        <div>
                            <div className="errs" id="err5">
                                <label className="updptp-label"></label>
                                <label className="updptp-error">Number of Floors should not be less than Zero</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="updptp-label">Property Papers</label>
                        <input className="updptp-input" type="file" disabled={true}/>
                    </div>
                    <button className="lb-buttons update" onClick={onClickUpdate}
                        id="updbtn" >UPDATE</button>
                    <input className="lb-buttons save" type="submit" value="SAVE" id="savebtn"/>
                    <button className="lb-buttons delete" onClick={toggleDeletePopup}
                        id="delbtn" >DELETE</button>
                </form>
            </div>
            <div>
                {isDeleteOpen && <Popup
                    handleClose={toggleDeletePopup}
                    content={
                        <div>
                            <p className="del-ques">Are you sure you want to delete the details of the Property Tax Payer?</p>
                            <button className="del-buttons cancel" onClick={toggleDeletePopup}>Cancel</button>
                            <button className="del-buttons delete" onClick={onClickDelete}>Delete</button>
                        </div>
                    }
                    />
                }
            </div>
        </div>
    )
}

export default UpdatePTP;