"use client";
import Link from "next/link";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "@/app/(Kambaz)/store";

export default function AccountNavigation() {
    const {currentUser} = useSelector((state: RootState) => state.accountReducer);
    const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
    return (
        <ListGroup id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href="Signin" id="wd-course-home-link">Signin</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href="Signup" id="wd-course-modules-link">Signup
            </ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href="Profile" id="wd-course-piazza-link">Profile</ListGroupItem>
        </ListGroup>
    );
}
