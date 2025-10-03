import Link from "next/link";
import {FormControl} from "react-bootstrap";

export default function Signin() {
    return (
        <div id="wd-signin-screen" style={{ width: "300px" }}>
            <h3>Sign in</h3>
            <FormControl id="wd-username"
                         placeholder="username"
                         className="mb-2"/>
            <FormControl id="wd-password"
                         placeholder="password"
                         className="mb-2"/>
            <Link id="wd-signin-btn"
                  className="btn btn-primary w-100 mb-2"
                  href="/Dashboard"> Sign in </Link> <br/>
            <Link id="wd-signup-link" href="Signup"> Sign up </Link>
        </div>
    );
}
