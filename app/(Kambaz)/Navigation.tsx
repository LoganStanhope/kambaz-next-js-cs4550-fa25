'use client';
import Link from "next/link";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {AiOutlineDashboard} from "react-icons/ai";
import {LiaBookSolid, LiaCogSolid} from "react-icons/lia";
import {FaInbox, FaRegUserCircle} from "react-icons/fa";
import {IoCalendar} from "react-icons/io5";
import {GoFileCode} from "react-icons/go";
import {usePathname} from "next/navigation";

export default function KambazNavigation() {
    const pname = usePathname();
    const pathname = usePathname();
    const links = [
        {label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard},
        {label: "Courses", path: "/Dashboard", icon: LiaBookSolid},
        {label: "Calendar", path: "/Calendar", icon: IoCalendar},
        {label: "Inbox", path: "/Inbox", icon: FaInbox},
        {label: "Labs", path: "/Labs", icon: LiaCogSolid},
    ];
    return (
        <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
                   className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
            <ListGroup.Item href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank" action
                            className="bg-black border-0 text-center">
                <img src="/images/NEU.png" width="75px"/></ListGroup.Item>
            <ListGroupItem href="/Account" as={Link}
                           className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
                <FaRegUserCircle className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`}>
                </FaRegUserCircle><br/>
                Account </ListGroupItem>
            {links.map((link) => (
                <ListGroupItem key={link.path} as={Link} href={link.path}
                               className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
                    {link.icon({className: "fs-1 text-danger"})}
                    <br/>
                    {link.label}
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}
