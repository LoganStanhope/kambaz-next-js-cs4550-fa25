"use client";
import {useDispatch, useSelector} from "react-redux";
import {addNewCourse, deleteCourse, enrollCourse, unenrollCourse, updateCourse} from "../Courses/reducer";
import {useState} from "react";
import Link from "next/link";
import {Card, Row, Col, Button, CardTitle, CardImg, CardText, CardBody, FormControl} from "react-bootstrap";

export default function Dashboard() {
    const { courses, enrollments } = useSelector((state: any) => state.coursesReducer);
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const [course, setCourse] = useState<any>({
        _id: "0", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15",
        image: "/images/reactjs.jpg", description: "New Description"
    });
    if (!currentUser) {
        return <h2>Please sign in to view your dashboard.</h2>;
    }
    const [showAllCourses, setShowAllCourses] = useState(false);
    const displayedCourses = showAllCourses
        ? courses
        : courses.filter(course =>
            enrollments.some(
                enrollment =>
                    enrollment.user === currentUser._id &&
                    enrollment.course === course._id
            )
        );
    const toggleEnrollment = (courseId: string) => {
        const isEnrolled = enrollments.some(
            (e) => e.user === currentUser._id && e.course === courseId
        );
        if (isEnrolled) {
            dispatch(unenrollCourse({user: currentUser._id, course: courseId}));
        } else {
            dispatch(enrollCourse({user: currentUser._id, course: courseId}));
        }
    };
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <h5>
                New Course
                <button
                    className="btn btn-success float-end"
                    id="wd-add-new-course-click"
                    onClick={() => dispatch(addNewCourse(course))}
                >
                    Add
                </button>
                <button
                    className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))}
                    id="wd-update-course-click"
                >
                    Update
                </button>
                <button
                    className="btn btn-primary float-end me-2"
                    onClick={() => setShowAllCourses(!showAllCourses)}
                    id="wd-update-course-click"
                >
                    Enroll
                </button>
            </h5>
            <hr/>
            <FormControl
                value={course.name}
                className="mb-2"
                onChange={(e) => setCourse({...course, name: e.target.value})}
            />
            <FormControl
                value={course.description}
                aria-rowcount={3}
                onChange={(e) => setCourse({...course, description: e.target.value})}
            />
            <hr/>
            <h2 id="wd-dashboard-published">Published Courses ({displayedCourses.length})</h2>
            <hr/>
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {displayedCourses.map((course) => {
                        const isEnrolled = enrollments.some(
                            (e) => e.user === currentUser._id && e.course === course._id
                        );

                        return (
                            <Col key={course._id} className="wd-dashboard-course" style={{width: "300px"}}>
                                <Card>
                                    <Link
                                        href={`/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark"
                                    >
                                        <CardImg src={course.src} variant="top" width="100%" height={160}/>
                                        <CardBody className="card-body">
                                            <CardTitle
                                                className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name}
                                            </CardTitle>
                                            <CardText
                                                className="wd-dashboard-course-description overflow-hidden"
                                                style={{height: "100px"}}
                                            >
                                                {course.description}
                                            </CardText>
                                            <Button variant="primary">Go</Button>
                                            <button
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    dispatch(deleteCourse(course._id));
                                                }}
                                                className="btn btn-danger float-end"
                                                id="wd-delete-course-click"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                id="wd-edit-course-click"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setCourse(course);
                                                }}
                                                className="btn btn-warning me-2 float-end"
                                            >
                                                Edit
                                            </button>
                                            <Button
                                                variant={isEnrolled ? "danger" : "success"}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation()
                                                    toggleEnrollment(course._id);
                                                }}
                                                className="mt-2"
                                            >
                                                {isEnrolled ? "Unenroll" : "Enroll"}
                                            </Button>
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}