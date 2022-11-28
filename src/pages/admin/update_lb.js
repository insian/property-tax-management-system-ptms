import React,{ useRef, useState} from "react";
import Select from "react-select";

import "./update_lb.css";
import { admindb, database, lbdb, publicdb } from "../database"
import { onValue, ref , update, remove} from "firebase/database";
import { Popup } from "../popup";

function UpdateLB(){
    document.title = "Update Local Body Details";
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
    const toggleDeletePopup = e => {
        e.preventDefault();
        setIsDeleteOpen(!isDeleteOpen);
    }

    var errCount = [0,0];
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

    var currentState =  localStorage.getItem("Username");
    const makeOptions = () => {
        var lb=[];
        if(currentState !== "")
            onValue(ref(database,lbdb+currentState),(snapshot)=>{
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

    const lbRef = useRef();
    const [selected, setSelected] = useState("");
    function onSelectLb(value){
        try{
            var select = value.value;
            setSelected(select);
            onValue(ref(database,lbdb + currentState +'/'+ select), (snapshot)=>{
                try{
                    document.getElementById("name").value = snapshot.val().lb;
                    document.getElementById("code").value = select;
                    document.getElementById("username").value = snapshot.val().username;
                    document.getElementById("add1").value = snapshot.val().address1;
                    document.getElementById("add2").value = snapshot.val().address2;
                    document.getElementById("phone").value = snapshot.val().phone;
                    document.getElementById("email").value = snapshot.val().email;
                }
                catch(e){
                    console.log("");
                }
            });
        }
        catch(e){
            console.log("");
        }
        document.getElementById("upd-div").style.display = "block";
    }

    const onClickUpdate = e => {
        e.preventDefault();
        document.getElementById("name").disabled = false;
        document.getElementById("username").disabled = false;
        document.getElementById("add1").disabled = false;
        document.getElementById("add2").disabled = false;
        document.getElementById("phone").disabled = false;
        document.getElementById("email").disabled = false;
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
        update(ref(database,lbdb+currentState+'/'+selected),{
            lb: document.getElementById("name").value,
            username: document.getElementById("username").value,
            address1: document.getElementById("add1").value,
            address2: document.getElementById("add2").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
        })
        window.location.reload();
        alert("Successfully updated the details");
    }

    const onClickDelete = e => {
        e.preventDefault();
        remove(ref(database,lbdb+currentState+'/'+selected));
        remove(ref(database,publicdb+currentState+"/"+selected));
        var i=0;
        onValue(ref(database,admindb+currentState),(snapshot)=>{
            const data = snapshot.val();
            i = data.nlp;
        })
        update(ref(database,admindb+currentState),{
            nlp: parseInt(i) - 1,
        })
        alert("Successfully deleted the local body details");
        window.location.reload();
    }

    return (
        <div id="admin-main">
            <p className="updlb-heading">Update Local Body</p>
            <Select className="upd-select" options={makeOptions()} isClearable ref={lbRef} id="dropdown" isDisabled={isDropdownDisabled} onChange={onSelectLb}/>
            <div className="updlb-first-div" id="upd-div">
                <form onSubmit={onClickSave}>
                    <div>
                        <label className="updlb-label">Lb Name</label>
                        <input className="updlb-input" type="text" placeholder="Name"
                            required="required" disabled={true} id="name"/>
                    </div>
                    <div>
                        <label className="updlb-label">Lb Code</label>
                        <input className="updlb-input" type="text" placeholder="Code" 
                            maxLength={3} required="required" disabled={true} id="code"/>
                    </div>
                    <div>
                        <label className="updlb-label">Username</label>
                        <input className="updlb-input" type="text" id="username"
                            placeholder="Username" required="required" disabled={true} />
                    </div>
                    <div>
                        <label className="updlb-label">Address Line 1</label>
                        <input className="updlb-input" type="text" id="add1"
                            placeholder="Address Line 1" required="required" disabled={true}/>
                    </div>
                    <div>
                        <label className="updlb-label">Address Line 2</label>
                        <input className="updlb-input" type="text" id="add2"
                           placeholder="Address Line 2" required="required"disabled={true}/>
                    </div>
                    <div>
                        <label className="updlb-label">Phone No</label>
                        <input className="updlb-input" type="text" id="phone"
                            maxLength={10} placeholder="Phone No" required="required" 
                            disabled={true} onChange={checkPhone}/>
                        <div>
                            <div className="errs" id="err1">
                                <label className="updlb-label"></label>
                                <label className="updlb-error" id="lerr1">error</label>
                            </div>
                        </div>
                        <div>
                            <div className="errs" id="err2">
                                <label className="updlb-label"></label>
                                <label className="updlb-error" id="lerr2">error</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="updlb-label">Email ID</label>
                        <input className="updlb-input" type="text" id="email"
                            placeholder="Email ID" required="required" disabled={true} />
                    </div>
                    <button className="admin-buttons update" onClick={onClickUpdate}
                        id="updbtn" >UPDATE</button>
                    <input className="admin-buttons save" type="submit" value="SAVE" id="savebtn"/>
                    <button className="admin-buttons delete" onClick={toggleDeletePopup}
                        id="delbtn" >DELETE</button>
                </form>
            </div>
            <div>
                {isDeleteOpen && <Popup
                    handleClose={toggleDeletePopup}
                    content={
                        <div>
                            <p className="del-ques">Are you sure you want to delete the details of the Local Body?</p>
                            <p className="del-note">Note: It will also delete the public info present under this local body</p>
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

export default UpdateLB;