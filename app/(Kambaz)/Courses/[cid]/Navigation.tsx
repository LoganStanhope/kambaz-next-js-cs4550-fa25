'use client';

import {ListGroup, ListGroupItem} from "react-bootstrap";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {RootState} from "@/app/(Kambaz)/store";
import {useSelector} from "react-redux";

export default function CourseNavigation({cid}: { cid: string }) {
    const {currentUser} = useSelector((state: RootState) => state.accountReducer);
    const pathname = usePathname();
    const adminLinks = [
        "Home",
        "Modules",
        "Piazza",
        "Zoom",
        "Assignments",
        "Quizzes",
        "Grades",
        "People",
        "Users"
    ]

    // Course-specific links
    const nonAdminlinks = [
        "Home",
        "Modules",
        "Piazza",
        "Zoom",
        "Assignments",
        "Quizzes",
        "Grades",
        "People"
    ];
    // @ts-ignore not important error
    const links = currentUser && currentUser?.role === "ADMIN" ? adminLinks : nonAdminlinks;

    return (
        <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => {
                const isActive = pathname.toLowerCase().includes(link.toLowerCase());

                // If the link is Users, override the href to /Users
                const href = link === "Users" ? "/Account/Users" : `/Courses/${cid}/${link}`;

                return (
                    <ListGroupItem
                        as={Link}
                        key={link}
                        href={href}
                        className={
                            isActive
                                ? "list-group-item border-0 text-black"
                                : "list-group-item border-0 text-danger"
                        }
                        id="wd-course-home-link"
                    >
                        {link}
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
}
