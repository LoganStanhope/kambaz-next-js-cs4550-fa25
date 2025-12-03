"use client";
import {redirect} from "next/dist/client/components/navigation";
import { RootState } from "../../store";
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {setCurrentUser} from "../reducer";
import {Button, FormControl} from "react-bootstrap";
import * as client from "../client";
import React from "react";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: RootState) => state.accountReducer);
    
    const formatRole = (role: string) => {
        if (!role) return "";
        const roleMap: { [key: string]: string } = {
            "USER": "User",
            "ADMIN": "Admin",
            "FACULTY": "Faculty",
            "STUDENT": "Student"
        };
        return roleMap[role] || role;
    };
    
    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        dispatch(setCurrentUser(updatedProfile));
    };
    const fetchProfile = () => {
        if (!currentUser) return redirect("/Account/Signin");
        setProfile(currentUser);
    };
    const signout = async () => {
        await client.signout();
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
                        value={profile.username || ""}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        id="wd-username"
                        placeholder="Username"
                        className={`mb-2 ${!profile.username ? "bg-light" : ""}`}
                    />
                    <FormControl 
                        id="wd-password"
                        value={profile.password || ""}
                                 onChange={(e) => setProfile({...profile, password: e.target.value})}
                        placeholder="Password"
                        type="password"
                        className={`mb-2 ${!profile.password ? "bg-light" : ""}`}
                    />
                    <FormControl 
                        id="wd-verify-password"
                        value={profile.firstName || ""}
                                 onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                                 placeholder="First Name"
                        className={`mb-2 ${!profile.firstName ? "bg-light" : ""}`}
                    />
                    <FormControl 
                        id="wd-last-name"
                        value={profile.lastName || ""}
                                 onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                                 placeholder="Last Name"
                        className={`mb-2 ${!profile.lastName ? "bg-light" : ""}`}
                    />
                    <FormControl 
                        id="wd-dob"
                        value={profile.dob || ""}
                                 onChange={(e) => setProfile({...profile, dob: e.target.value})}
                                 type="date"
                        placeholder="Date of Birth"
                        className={`mb-2 ${!profile.dob ? "bg-light" : ""}`}
                    />
                    <FormControl 
                        id="wd-email"
                        value={profile.email || ""}
                                 onChange={(e) => setProfile({...profile, email: e.target.value})}
                        type="email"
                        placeholder="Email"
                        className={`mb-2 ${!profile.email ? "bg-light" : ""}`}
                    />
                    
                    {/* Role selection - all roles available */}
                    <div className="mb-2">
                        <label className="form-label">Role</label>
                        <select 
                            className="form-control" 
                            id="wd-role"
                            value={profile.role || "USER"}
                            onChange={(e) => setProfile({...profile, role: e.target.value})}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </select>
                    </div>
                    <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update</button>
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