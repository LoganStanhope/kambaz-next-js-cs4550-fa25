'use client';
import {ListGroup, ListGroupItem} from "react-bootstrap";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function CourseNavigation({cid}: { cid: string }) {
    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
    const pathname = usePathname();

    return (
        <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => (
                <ListGroupItem as={Link}
                               key={`${link}-${cid}`}
                               className={pathname.includes(link)?
                                   "list-group-item border-0 border border-0 text-black" :
                                   "list-group-item border-0 border border-0 text-danger"}
                               href={`/Courses/${cid}/${link}`} active={pathname.includes(link)}
                               id="wd-course-home-link">{link}</ListGroupItem>
            ))}
        </ListGroup>
    );
}
