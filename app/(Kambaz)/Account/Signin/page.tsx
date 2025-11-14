"use client";
import Link from "next/link";
import {setCurrentUser} from "../reducer";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {redirect, useRouter} from "next/navigation";
import {FormControl, Button} from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();
    const signin = async () => {
        const user = await client.signin(credentials);

        if (!user) return;
        dispatch(setCurrentUser(user));
        redirect("/Dashboard");
    };
    return (
        <div id="wd-signin-screen" style={{width: "300px"}}>
            <h3>Sign in</h3>
            <FormControl value={credentials.username}
                         onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                         id="wd-username"
                         placeholder="username"
                         className="mb-2"/>
            <FormControl value={credentials.password}
                         onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                         id="wd-password"
                         placeholder="password"
                         className="mb-2"/>
            <Button id="wd-signin-btn"
                    onClick={signin}
                    className="btn btn-primary w-100 mb-2"> Sign in </Button> <br/>
            <Link id="wd-signup-link" href="Signup"> Sign up </Link>
        </div>
    );
}
