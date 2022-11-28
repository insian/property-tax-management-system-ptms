import React,{ useRef } from "react";
import "./add_lb.css";

import { admindb, database, lbdb } from "../database"
import { onValue, ref , set, update} from "firebase/database";
import { useNavigate } from "react-router-dom";

function AddLb(){
    document.title = "Add Local Body";
    const navigate = useNavigate();
    const navigateToAdmin = () => {
        navigate("/admin");
    }
    const nameRef = useRef();
    const codeRef = useRef();
    const userNameRef = useRef();
    const add1Ref = useRef();
    const add2Ref = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const pRef = useRef();
    const cpRef = useRef();
    var errCount = [0,0,0,0,0,0];
    const currentState = localStorage.getItem("Username");
    const checkCode = e => {
        if((codeRef.current.value.length > 0) && (codeRef.current.value.length < 3)){
            document.getElementById("lerr1").innerText = "Lb Code should have 3 characters";
            document.getElementById("err1").style.display = "block";
            errCount[0]=1
        }
        else{
            document.getElementById("err1").style.display = "none";
            errCount[0]=0;
        }
        if((codeRef.current.value.length > 0) && (!codeRef.current.value.match(/^[A-Z]+$/))){
            document.getElementById("lerr2").innerText = "All characters should be in uppercase alphabets";
            document.getElementById("err2").style.display = "block";
            errCount[1]=1;
        }
        else{
            document.getElementById("err2").style.display = "none";
            errCount[1]=0;
        }
        if((codeRef.current.value.length === 3) && (codeRef.current.value.match(/^[A-Z]+$/))){
            var data;
            onValue(ref(database,lbdb+currentState),(snapshot)=>{
                data = Object.keys(snapshot.val());
            })
            const value = codeRef.current.value;
            var check = 0;
            for(var item in data){
                if(data[item] === value)
                    check = 1;
            }
            
            if(check){
                document.getElementById("lerr3").innerText = "Lb Code already taken";
                document.getElementById("err3").style.display = "block";
                errCount[2]=1;
            }
        }
        else{
            document.getElementById("err3").style.display = "none";
            errCount[2]=0;
        }
    }

    const checkPhone = e => {
        if((phoneRef.current.value.length > 0) && (phoneRef.current.value.length < 10)){
            document.getElementById("lerr4").innerText = "Phone No. should have 10 digits";
            document.getElementById("err4").style.display = "block";
            errCount[3]=1;
        }
        else{
            document.getElementById("err4").style.display = "none";
            errCount[3]=0;
        }
        if((phoneRef.current.value.length > 0) && (!phoneRef.current.value.match(/^[0-9]+$/))){
            document.getElementById("lerr5").innerText = "All characters should be digits";
            document.getElementById("err5").style.display = "block";
            errCount[4]=1;
        }
        else{
            document.getElementById("err5").style.display = "none";
            errCount[4]=0;
        }
    }

    const checkCP = e => {
        if(pRef.current.value !== cpRef.current.value){
            document.getElementById("lerr6").innerText = "Confirm Password doesn't match the Password";
            document.getElementById("err6").style.display = "block";
            errCount[5]=1;
        }
        else{
            document.getElementById("err6").style.display = "none";
            errCount[5]=0;
        }
    }

    const onAddLB = e => {
        e.preventDefault();
        for(var item in errCount){
            if(errCount[item] === 1){
                alert("Please recheck all the errors in the form");
                return;
            }
        }
        set(ref(database,lbdb+currentState+"/"+codeRef.current.value),{
            lb: nameRef.current.value,
            username: userNameRef.current.value,
            address1: add1Ref.current.value,
            address2: add2Ref.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            password: pRef.current.value,
            nptp:0,
            actual_ptp:0,
        })
  
        var i=0;
        onValue(ref(database,lbdb+currentState),(snapshot)=>{
            const data = snapshot.val();
            for(var item in data)
                i++;
        })
        update(ref(database,admindb+currentState),{
            nlp: i,
        })

        alert("Successfully added the local body details");
        navigateToAdmin();
    }

    return (
        <div id="admin-main">
            <p className="addlb-heading">Add Local Body</p>
            <div className="addlb-first-div">
                <form onSubmit={onAddLB} >
                    <div>
                        <label className="addlb-label">Lb Name</label>
                        <input className="addlb-input" type="text" placeholder="Name"
                            required="required" ref={nameRef} />
                    </div>
                    <div>
                        <label className="addlb-label">Lb Code</label>
                        <input className="addlb-input" type="text" placeholder="Code" 
                            maxLength={3} onChange={checkCode} ref={codeRef} required="required" />
                        <div>
                            <div className="errs" id="err1">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr1">error</label>
                            </div>
                            <div className="errs" id="err2">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr2">error</label>
                            </div>
                            <div className="errs" id="err3">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr3">error</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addlb-label">Username</label>
                        <input className="addlb-input" type="text" ref={userNameRef}
                            placeholder="Username" required="required" />
                    </div>
                    <div>
                        <label className="addlb-label">Address Line 1</label>
                        <input className="addlb-input" type="text" ref={add1Ref}
                            placeholder="Address Line 1" required="required" />
                    </div>
                    <div>
                        <label className="addlb-label">Address Line 2</label>
                        <input className="addlb-input" type="text" ref={add2Ref}
                            placeholder="Address Line 2" required="required" />
                    </div>
                    <div>
                        <label className="addlb-label">Phone No</label>
                        <input className="addlb-input" type="text" onChange={checkPhone} 
                            maxLength={10} ref={phoneRef} placeholder="Phone No" required="required" />
                        <div>
                            <div className="errs" id="err4">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr4">error</label>
                            </div>
                        </div>
                        <div>
                            <div className="errs" id="err5">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr5">error</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="addlb-label">Email ID</label>
                        <input className="addlb-input" type="text" ref={emailRef}
                            placeholder="Email ID" required="required" />
                    </div>
                    <div>
                        <label className="addlb-label">Password</label>
                        <input className="addlb-input" type="password" ref={pRef}
                            placeholder="Password" required="required" />
                    </div>
                    <div>
                        <label className="addlb-label">Confirm Password</label>
                        <input className="addlb-input" type="password" ref={cpRef} 
                            placeholder="Condfirm Password" onChange={checkCP} required="required" />
                        <div>
                            <div className="errs" id="err6">
                                <label className="addlb-label"></label>
                                <label className="addlb-error" id="lerr6" >error</label>
                            </div>
                        </div>
                    </div>
                    <input className="admin-buttons add" type="submit" value="ADD" />
                    <button className="admin-buttons cancel" onClick={navigateToAdmin}>CANCEL</button>
                </form>
            </div>
        </div>
    )
}

export default AddLb;