import React from "react";
import "./Contact.css";

function Contact(){
    document.title = "Contact Us";
    return (
        <div id="contact-main">
            <div className="contact-first">
                <p className="contact-heading">Contact Us</p>
                <table className="table-contact">
                    <tbody>
                        <tr>
                            <td className="first-col">Name</td>
                            <td className="second-col">Soham Patra</td>
                        </tr>
                        <tr>
                            <td className="first-col">Address</td>
                            <td className="second-col">Kalpana Boys Pg,Nayapatty AN Block, Sector V, opposite to Technopolis, Kolkata - 700091</td>
                        </tr>
                        <tr>
                            <td className="first-col">Phone No.</td>
                            <td className="second-col">9427071291</td>
                        </tr>
                        <tr>
                            <td className="first-col">Email Id</td>
                            <td className="second-col">patrasoham1512@gmail.com</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Contact;