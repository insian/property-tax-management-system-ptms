import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import "./Login.css";
import adminIcon from "./icons/admin_icon.png";
import lbIcon from "./icons/lb_icon.png";
import publicIcon from "./icons/public_icon.png";
import { Popup } from "./popup";
import { database } from "./database";  
import { onValue, ref } from "firebase/database";
import { admindb, lbdb, publicdb } from "./database";

function Login(){
    document.title = "Property Tax Management System";
    /*Storing logged in variables*/
    localStorage.setItem("adminLoggedIn", "false");
    localStorage.setItem("lbLoggedIn", "false");
    localStorage.setItem("publicLoggedIn","false");
    localStorage.setItem("Username","");

    /*Pop up functions*/
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const toggleAdminPopup = () => {
        setIsAdminOpen(!isAdminOpen);
    }
    
    const [isLbOpen, setIsLbOpen] = useState(false);
    const toggleLbPopup = () => {
        setIsLbOpen(!isLbOpen);
    }
    
    const [isPublicOpen, setIsPublicOpen] = useState(false);
    const togglePublicPopup = () => {
        setIsPublicOpen(!isPublicOpen);
    }
    /*End of Popup Functions*/

    /*Navigator Function*/
    const navigate = useNavigate();
    const navigateToAdmin = () => {
        navigate('/admin');
    }
    const navigateToLb = () => {
        navigate('/rlb_ulb');
    }
    const navigateToPublic = () => {
        navigate('/public');
    }
    /*End of Navigator Functions*/
    
    const [currentUsername,setCurrentUsername] = useState();
    const [currentPassword,setCurrentPassword] = useState();
    
    const [dropdownState, setDropdownState] = useState("");
    const [dropdownLb, setDropdownLb] = useState("");
    const lbRef = useRef();

    const makeOptions = (value) => {
        if(value === "state"){
            var state=[];
            onValue(ref(database,admindb),(snapshot)=>{
                try{
                    const data = Object.keys(snapshot.val());
                    for( var item in data)
                        state.push({
                            label: snapshot.val()[data[item]].state,
                            value: data[item],
                        })
                    }
                catch(e){
                    console.log("");
                }
            })
            return state;
        }
        else if(value === "lb"){
            var lb=[];
            if(dropdownState !== "")
                onValue(ref(database,lbdb+dropdownState),(snapshot)=>{
                    try{
                        const data = Object.keys(snapshot.val());
                        for ( var item in data)
                            lb.push({
                                label: snapshot.val()[data[item]].lb,
                                value: data[item],
                            })
                    }
                    catch(e){
                        console.log("");
                    }
                })
            return lb;
        }  
    }

    function onChangeState(value){
        try{
            lbRef.current.setValue(null);
        }
        catch(e){
            console.log("");
        }
        try{
            setDropdownState(value.value);
        }
        catch(e){
            setDropdownState("");
        }
    }

    function onChangeLb(value){
        try{
            setDropdownLb(value.value);
        }
        catch(e){
            setDropdownLb("");
        }
    }
    const handleAdminLogin = e => {
        e.preventDefault();
        var data;
        if(dropdownState !== ""){
            onValue(ref(database,admindb+dropdownState),
            (snapshot)=>{
                data = snapshot.val();
            }
            )
        }
        try{
            if(data.username===currentUsername && data.password===currentPassword){
                localStorage.setItem("Username",dropdownState);
                localStorage.setItem("adminLoggedIn", "true");
                navigateToAdmin();
            }
            else{
                alert("Please check if all the credentials are filled correctly or not");
            }
        }
        catch(ev){
            alert("Please check if all the credentials are filled correctly or not");
        }
    }

    const handleLbLogin = e => {
        e.preventDefault();
        var data;
        if(dropdownLb !== ""){
            onValue(ref(database,lbdb+dropdownState+"/"+dropdownLb),
            (snapshot)=>{
                data = snapshot.val();
            }
            )
        }
        try{
            if(data.username===currentUsername && data.password===currentPassword){
                localStorage.setItem("Username",dropdownState+dropdownLb);
                localStorage.setItem("lbLoggedIn", "true");
                navigateToLb();
            }
            else{
                alert("Please check if all the credentials are filled correctly or not");
            }
        }
        catch(ev){
            alert("Please check if all the credentials are filled correctly or not");
        }
    }

    const handlePublicLogin = e => {
        e.preventDefault();
        var data;
        try{
            if(currentUsername !== ""){
                onValue(ref(database,publicdb+dropdownState+"/"+dropdownLb+"/"+currentUsername),
                (snapshot)=>{
                    data = snapshot.val();
                    try{
                        if(data.password===currentPassword){
                            localStorage.setItem("Username",currentUsername);
                            localStorage.setItem("publicLoggedIn", "true");
                            navigateToPublic();
                        }
                        else{
                            alert("Please check if all the credentials are filled correctly or not");
                        }
                    }
                    catch(e){
                        alert("Please check if all the credentials are filled correctly or not")
                    }
                }
                )
            }
            
        }
        catch(ev){
            alert("Please check if all the credentials are filled correctly or not");
        }
    }

    return (
        <div id="login-main">
            <div className="login-first">
                <button className="login-btn" onClick={toggleAdminPopup}>
                    <img className="login-icons" src={adminIcon} alt="admin-png" />
                    <p className="login-para">Admin</p>
                </button>
                <button className="login-btn" onClick={toggleLbPopup}>
                    <img className="login-icons" src={lbIcon} alt="admin-png" />
                    <p className="login-para">RLB/ULB</p>
                </button>
                <button className="login-btn" onClick={togglePublicPopup}>
                    <img className="login-icons" src={publicIcon} alt="admin-png" />
                    <p className="login-para">Public</p>
                </button>
                
                {/*Admin Pop Up Section*/} 
                <div>
                    {isAdminOpen && <Popup
                        handleClose={toggleAdminPopup}
                        content={
                        <div>
                            <form onSubmit={handleAdminLogin} className="popup-form">
                                <p className="form-heading">Admin Login</p>
                                <div>
                                    <label className="form-labels">State</label>
                                    <Select className="form-select" options={makeOptions("state")} isClearable 
                                       onChange={onChangeState} />
                                </div>
                                <div>
                                    <label className="form-labels">Username</label>
                                    <input  className="form-inputs" type="text" 
                                        placeholder="Username" onChange={e => setCurrentUsername(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="form-labels">Password</label>
                                    <input className="form-inputs" type="password" 
                                        placeholder="Password" onChange={e => setCurrentPassword(e.target.value)}/>
                                </div>   
                                <input className="form-submit" type="submit" value="Login"></input>
                            </form>
                        </div>
                        }
                        />
                    }
                </div>

                {/*Local Body Pop Up Section*/} 
                <div>
                    {isLbOpen && <Popup
                        handleClose={toggleLbPopup}
                        content={
                        <div>
                            <form onSubmit={handleLbLogin} className="popup-form">
                                <p className="form-heading">Local Body Login</p>
                                <div>
                                    <label className="form-labels">State</label>
                                    <Select className="form-select" options={makeOptions("state")} isClearable 
                                       onChange={onChangeState} />
                                </div>
                                <div>
                                    <label className="form-labels">Local Body</label>
                                    <Select className="form-select" options={makeOptions("lb")} isClearable
                                        onChange={onChangeLb} ref={lbRef} />
                                </div>
                                <div>
                                    <label className="form-labels">Username</label>
                                    <input  className="form-inputs" type="text" 
                                        placeholder="Username" onChange={e => setCurrentUsername(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="form-labels">Password</label>
                                    <input className="form-inputs" type="password" 
                                        placeholder="Password" onChange={e => setCurrentPassword(e.target.value)}/>
                                </div>   
                                <input className="form-submit" type="submit" value="Login"></input>
                            </form>
                        </div>
                        }
                        />
                    }
                </div>

                {/*Public Pop Up Section*/} 
                <div className="popup">
                    {isPublicOpen && <Popup
                        handleClose={togglePublicPopup}
                        content={
                        <div>
                            <form onSubmit={handlePublicLogin} className="popup-form">
                                <p className="form-heading">Public Login</p>
                                <div>
                                    <label className="form-labels">State</label>
                                    <Select className="form-select" options={makeOptions("state")} isClearable 
                                       onChange={onChangeState} />
                                </div>
                                <div>
                                    <label className="form-labels">Local Body</label>
                                    <Select className="form-select" options={makeOptions("lb")} isClearable
                                        onChange={onChangeLb} ref={lbRef} />
                                </div>
                                <div>
                                    <label className="form-labels">PID Number</label>
                                    <input  className="form-inputs" type="text" 
                                        placeholder="Username" onChange={e => setCurrentUsername(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="form-labels">Password</label>
                                    <input className="form-inputs" type="password" 
                                        placeholder="Password" onChange={e => setCurrentPassword(e.target.value)}/>
                                </div>   
                                <input className="form-submit" type="submit" value="Login"></input>
                            </form>
                        </div>
                        }
                        />
                    }
                </div>
            </div>    
        </div>
    );
}

export default Login;