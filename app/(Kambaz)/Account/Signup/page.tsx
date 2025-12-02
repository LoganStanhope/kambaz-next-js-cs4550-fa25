"use client";
import Link from "next/link";
import {redirect} from "next/navigation";
import {setCurrentUser} from "../reducer";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {FormControl, Button, FormSelect} from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
    const [user, setUser] = useState<any>({role: "STUDENT"});
    const dispatch = useDispatch();
    const signup = async () => {
        const currentUser = await client.signup(user);
        dispatch(setCurrentUser(currentUser));
        redirect("/Account/Profile");
    };
    return (
        <div id="wd-signup-screen" style={{width: "300px"}}>
            <h3>Sign up</h3>
            <FormControl id="wd-username"
                         value={user.username ?? ""}
                         onChange={(e) => setUser({...user, username: e.target.value})}
                         placeholder="username"
                         className="mb-2"/>
            <FormControl id="wd-password"
                         value={user.password ?? ""}
                         onChange={(e) => setUser({...user, password: e.target.value})}
                         placeholder="password"
                         type="password"
                         className="mb-2"/>
            <FormSelect id="wd-role"
                        value={user.role ?? "STUDENT"}
                        onChange={(e) => setUser({...user, role: e.target.value})}
                        className="mb-2">
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
            </FormSelect>
            <button id="wd-signin-btn"
                    className="btn btn-primary w-100 mb-2"
                    onClick={signup}> Sign up
            </button>
            <br/>
            <Link id="wd-signup-link" href="/Account/Signin"> Sign in </Link>
        </div>
    );
}
