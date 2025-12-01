"use client";
import {useDispatch, useSelector} from "react-redux";
import * as client from "../Courses/client";
import {
    enrollCourse,
    unenrollCourse,
    setCourses, setEnrollments,
} from "../Courses/reducer";
import {useEffect, useState} from "react";
import Link from "next/link";
import {
    Card,
    Row,
    Col,
    Button,
    CardTitle,
    CardImg,
    CardText,
    CardBody,
    FormControl
} from "react-bootstrap";
import {RootState} from "../store";

export default function Dashboard() {
    const dispatch = useDispatch();
    const {courses, enrollments} = useSelector((state: RootState) => state.coursesReducer);
    const {currentUser} = useSelector((state: RootState) => state.accountReducer) as any;

    const [showAllCourses, setShowAllCourses] = useState(false);

    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.svg",
        description: "New Description"
    });

    /** ------------------------------ FETCHING ----------------------------- **/

        // Load ALL courses initially
    const loadAllCourses = async () => {
            const all = await client.fetchAllCourses();
            dispatch(setCourses(all));
        };

    // Load user enrollments (courses stay unchanged)
    const loadMyEnrollments = async () => {
        const myCourses = await client.fetchEnrollments(currentUser._id);
        const ids = myCourses.map((c: any) => c._id);

        dispatch(setEnrollments(
            ids.map((courseId: string) => ({
                user: currentUser._id,
                course: courseId
            }))
        ));
    };

    useEffect(() => {
        if (currentUser) {
            loadAllCourses();
            loadMyEnrollments();
        }
    }, [currentUser]);

    if (!currentUser) return <h2>Please sign in to view your dashboard.</h2>;

    /** ------------------------------ ENROLLMENT --------------------------- **/

    const toggleEnrollment = async (courseId: string) => {
        const isEnrolled = enrollments.some(
            (e) => e.user === currentUser._id && e.course === courseId
        );

        if (isEnrolled) {
            // Call backend
            await client.unenroll(currentUser._id, courseId);

            // Update Redux
            dispatch(unenrollCourse({
                user: currentUser._id,
                course: courseId
            }));
        } else {
            // Call backend
            await client.enroll(currentUser._id, courseId);

            // Update Redux
            dispatch(enrollCourse({
                user: currentUser._id,
                course: courseId
            }));
        }

        // Refresh enrollment list from DB to stay in sync
        await loadMyEnrollments();
    };

    /** ------------------------------ FILTERING ---------------------------- **/

    const displayedCourses = showAllCourses
        ? courses
        : courses.filter((c) =>
            enrollments.some(
                (e) => e.user === currentUser._id && e.course === c._id
            )
        );

    /** ------------------------------ RENDER ------------------------------- **/

    return (
        <div id="wd-dashboard">
            <h1>Dashboard</h1>

            <h5>
                New Course
                <button className="btn btn-success float-end" onClick={async () => {
                    const newCourse = await client.createCourse(course);
                    dispatch(setCourses([...courses, newCourse]));
                }}>
                    Add
                </button>

                <button className="btn btn-warning float-end me-2"
                        onClick={async () => {
                            await client.updateCourse(course);
                            dispatch(
                                setCourses(courses.map((c) =>
                                    c._id === course._id ? course : c
                                ))
                            );
                        }}>
                    Update
                </button>

                <button
                    className="btn btn-primary float-end me-2"
                    onClick={() => setShowAllCourses(!showAllCourses)}
                >
                    {showAllCourses ? "Show Enrolled Only" : "Show All Courses"}
                </button>
            </h5>

            <hr/>

            <FormControl
                value={course.name}
                onChange={(e) =>
                    setCourse({...course, name: e.target.value})
                }
                className="mb-2"
            />

            <FormControl
                value={course.description}
                onChange={(e) =>
                    setCourse({...course, description: e.target.value})
                }
            />

            <hr/>

            <h2>
                {showAllCourses
                    ? `All Courses (${courses.length})`
                    : `My Enrolled Courses (${displayedCourses.length})`}
            </h2>

            <hr/>

            <Row xs={1} md={5} className="g-4">
                {displayedCourses.map((course) => {
                    const isEnrolled = enrollments.some(
                        (e) => e.user === currentUser._id && e.course === course._id
                    );

                    return (
                        <Col key={course._id} style={{width: "300px"}}>
                            <Card>
                                <Link
                                    href={`/Courses/${course._id}/Home`}
                                    className="text-decoration-none text-dark"
                                >
                                    <CardImg
                                        src={course.src}
                                        width="100%"
                                        height={160}
                                    />

                                    <CardBody>
                                        <CardTitle>{course.name}</CardTitle>

                                        <CardText style={{height: "100px"}}>
                                            {course.description}
                                        </CardText>

                                        <Button variant="primary">Go</Button>

                                        <button
                                            className="btn btn-danger float-end"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                client.deleteCourse(course._id);
                                                dispatch(
                                                    setCourses(
                                                        courses.filter(
                                                            (c) => c._id !== course._id
                                                        )
                                                    )
                                                );
                                            }}
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="btn btn-warning me-2 float-end"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCourse(course);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <Button
                                            className="mt-2"
                                            variant={isEnrolled ? "danger" : "success"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleEnrollment(course._id);
                                            }}
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
    );
}
