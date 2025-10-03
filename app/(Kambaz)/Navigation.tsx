'use client';
import Link from "next/link";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {AiOutlineDashboard} from "react-icons/ai";
import {LiaBookSolid} from "react-icons/lia";
import {FaInbox, FaRegUserCircle} from "react-icons/fa";
import {IoCalendar} from "react-icons/io5";
import {GoFileCode} from "react-icons/go";
import {usePathname} from "next/navigation";

export default function KambazNavigation() {
    const pname = usePathname();
    const isClicked = (href: string) => pname?.startsWith(href);

    return (
        <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
                   className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
            <ListGroup.Item href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank" action
                            className="bg-black border-0 text-center">
                <img src="/images/NEU.png" width="75px"/></ListGroup.Item>

            <ListGroupItem href="/Account" as={Link}
                           className={`text-center border-0 ${
                               isClicked("/Account") ? "bg-white text-danger" : "bg-black text-white"
                           }`}>
                <FaRegUserCircle className={`fs-1 text-danger`}></FaRegUserCircle><br/>
                Account </ListGroupItem>


            <ListGroup.Item href="/Dashboard" as={Link}
                            className={`text-center border-0 ${
                                isClicked("/Dashboard") ? "bg-white text-danger" : "bg-black text-white"
                            }`}>
                <AiOutlineDashboard className="fs-1 text-danger"/><br/>
                Dashboard </ListGroup.Item>

            <ListGroup.Item href="/Dashboard" as={Link}
                            className="text-center border-0 bg-black text-white">
                                {/*{`text-center border-0 ${*/}
                                {/*isClicked("/Dashboard") ? "bg-white text-danger" : "bg-black text-white"*/}
                            {/*}`}>*/}
                <LiaBookSolid className="fs-1 text-danger"/><br/>
                Courses </ListGroup.Item>

            <ListGroup.Item href="/Calendar" as={Link}
                            className={`text-center border-0 ${
                                isClicked("/Calendar") ? "bg-white text-danger" : "bg-black text-white"
                            }`}>
                <IoCalendar className="fs-1 text-danger"/><br/>
                Calendar </ListGroup.Item>

            <ListGroup.Item href="/Inbox" as={Link}
                            className={`text-center border-0 ${
                                isClicked("/Inbox") ? "bg-white text-danger" : "bg-black text-white"
                            }`}>
                <FaInbox className="fs-1 text-danger"/><br/>
                Inbox </ListGroup.Item>

            <ListGroup.Item href="/Labs/Lab1" as={Link}
                            className={`text-center border-0 ${
                                isClicked("/Labs") ? "bg-white text-danger" : "bg-black text-white"
                            }`}>
                <GoFileCode className="fs-1 text-danger"/><br/>
                Labs </ListGroup.Item>
        </ListGroup>
    );
}
