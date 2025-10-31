"use client";
import {redirect} from "next/dist/client/components/navigation";
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {setCurrentUser} from "../reducer";
import Link from "next/link";
import {Button, Col, FormControl, FormGroup, FormLabel, FormSelect, Row} from "react-bootstrap";
import React from "react";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const fetchProfile = () => {
        if (!currentUser) return redirect("/Account/Signin");
        setProfile(currentUser);
    };
    const signout = () => {
        dispatch(setCurrentUser(null));
        redirect("/Account/Signin");
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    return (
        <div id="wd-profile-screen" style={{width: "300px"}} className="me-5">
            <h3>Profile</h3>
            {profile && (
                <div>
                    <FormControl
                        defaultValue={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        id="wd-username"
                        placeholder="username"
                        className="mb-2"/>
                    <FormControl id="wd-password"
                                 defaultValue={profile.password}
                                 onChange={(e) => setProfile({...profile, password: e.target.value})}
                                 placeholder="password"
                                 className="mb-2"/>
                    <FormControl id="wd-verify-password"
                                 defaultValue={profile.firstName}
                                 onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                                 placeholder="First Name"
                                 className="mb-2"/>
                    <FormControl id="wd-last-name"
                                 defaultValue={profile.lastName}
                                 onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                                 placeholder="Last Name"
                                 className="mb-2"/>
                    <FormControl id="wd-dob"
                                 defaultValue={profile.dob}
                                 onChange={(e) => setProfile({...profile, dob: e.target.value})}
                                 type="date"
                                 className="mb-2"/>
                    <FormControl id="wd-email"
                                 defaultValue={profile.email}
                                 onChange={(e) => setProfile({...profile, email: e.target.value})}
                                 type="email"/>
                    {/*<FormControl id="wd-user"*/}
                    {/*             defaultValue="User"/>*/}
                    <select className="form-control mb-2" id="wd-role"
                            onChange={(e) => setProfile({...profile, role: e.target.value})}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        {" "}
                        <option value="STUDENT">Student</option>
                    </select>
                    <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
                        Sign out
                    </Button>
                    {/*<Link id="wd-signout-btn"*/}
                    {/*      style={{background: "red", borderColor: "red"}}*/}
                    {/*      className="btn btn-primary w-100 mb-5 me-5"*/}
                    {/*      href="Profile"> Signout </Link>*/}
                </div>
            )}
        </div>
    );
}