'use client';
import {ListGroup, ListGroupItem} from "react-bootstrap";
import Link from "next/link";

export default function CourseNavigation({cid}: { cid: string }) {

    return (
        <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Home`} active id="wd-course-home-link">Home</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Modules`} id="wd-course-modules-link">Modules
            </ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Piazza`} id="wd-course-piazza-link">Piazza</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Zoom`} id="wd-course-zoom-link">Zoom</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link">
                Assignments</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Quizzes`} id="wd-course-quizzes-link">Quizzes
            </ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/Grades`} id="wd-course-grades-link">Grades</ListGroupItem>
            <ListGroupItem as={Link} className="list-group-item border-0 border border-0 text-danger"
                           href={`/Courses/${cid}/People`} id="wd-course-people-link">People</ListGroupItem>
        </ListGroup>
    );
}
