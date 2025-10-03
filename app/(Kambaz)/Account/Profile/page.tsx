import Link from "next/link";
import {Button, Col, FormControl, FormGroup, FormLabel, FormSelect, Row} from "react-bootstrap";
import React from "react";
export default function Profile() {
    return (
        <div id="wd-profile-screen" style={{ width: "300px" }} className="me-5">
            <h3>Profile</h3>
            <FormControl id="wd-username"
                         defaultValue="alice"
                         placeholder="username"
                         className="mb-2"/>
            <FormControl id="wd-password"
                         defaultValue="123"
                         placeholder="password"
                         className="mb-2"/>
            <FormControl id="wd-verify-password"
                         defaultValue="Alive"
                         placeholder="First Name"
                         className="mb-2"/>
            <FormControl id="wd-last-name"
                         defaultValue="Wonderland"
                         placeholder="Last Name"
                         className="mb-2"/>
            <FormControl id="wd-dob"
                         defaultValue="mm/dd/yyyy"
                         type="date"
                         className="mb-2"/>
            <FormControl id="wd-email"
                         defaultValue="alice@wonderland"
                         type="email" />
            <FormControl id="wd-user"
                         defaultValue="User"/>
            <Link id="wd-signout-btn"
                  style={{ background : "red", borderColor: "red"}}
                  className="btn btn-primary w-100 mb-5 me-5"
                  href="Profile"> Signout </Link>
        </div>
    );}