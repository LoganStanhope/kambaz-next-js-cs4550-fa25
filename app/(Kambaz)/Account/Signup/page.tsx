import React from "react";
import Link from "next/link";
import {FormControl} from "react-bootstrap";

export default function Signup() {
    return (
        <div id="wd-signup-screen" style={{ width: "300px" }}>
            <h3>Sign up</h3>
            <FormControl id="wd-username"
                         placeholder="username"
                         className="mb-2"/>
            <FormControl id="wd-password"
                         placeholder="password"
                         className="mb-2"/>
            <FormControl id="wd-verify-password"
                         placeholder="verify password"
                         className="mb-2"/>
            <Link id="wd-signin-btn"
                  className="btn btn-primary w-100 mb-2"
                  href="Profile"> Sign up </Link> <br/>
            <Link id="wd-signup-link" href="Signin"> Sign in </Link>
        </div>
    );
}
