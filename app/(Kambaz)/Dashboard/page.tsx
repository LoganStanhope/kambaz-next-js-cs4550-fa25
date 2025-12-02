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
    FormControl,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter
} from "react-bootstrap";
import {RootState} from "../store";

export default function Dashboard() {
    const dispatch = useDispatch();
    const {courses, enrollments} = useSelector((state: RootState) => state.coursesReducer);
    const {currentUser} = useSelector((state: RootState) => state.accountReducer) as any;

    const [showAllCourses, setShowAllCourses] = useState(false);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [allAvailableCourses, setAllAvailableCourses] = useState<any[]>([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: string]: boolean}>({});
    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role === "STUDENT";
    const isUser = currentUser?.role === "USER";
    const canEnroll = isStudent || isUser; // Both students and users can enroll when 

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

    // Load courses based on user role
    const loadCourses = async () => {
        if (!currentUser?._id) return;

        if (isFaculty) {
            // Faculty: Load courses they created
            const createdCourses = await client.findCoursesCreatedByUser("current");
            dispatch(setCourses(createdCourses || []));
        } else if (canEnroll) {
            // Students and Users: Load only enrolled courses
            const myCourses = await client.fetchEnrollments(currentUser._id);
            const enrolledCourseIds = (myCourses || []).filter(Boolean).map((c: any) => c._id);
            
            // Get all courses to filter enrolled ones
            const all = await client.fetchAllCourses();
            const enrolledCourses = all.filter((c: any) => enrolledCourseIds.includes(c._id));
            dispatch(setCourses(enrolledCourses || []));
            
            // Store all courses for the enrollment modal
            setAllAvailableCourses(all || []);
        } else {
            // Default: Load all courses
            const all = await client.fetchAllCourses();
            dispatch(setCourses(all || []));
        }
    };

    // Load user enrollments
    const loadMyEnrollments = async () => {
        if (!currentUser?._id) return;

        const myCourses = await client.fetchEnrollments(currentUser._id);
        const ids = (myCourses || []).filter(Boolean).map((c: any) => c._id);

        dispatch(setEnrollments(
            ids.map((courseId: string) => ({
                user: currentUser._id,
                course: courseId
            }))
        ));
    };

    useEffect(() => {
        if (currentUser) {
            loadCourses();
            if (canEnroll) {
                loadMyEnrollments();
            }
        }
    }, [currentUser]);

    // Check if user/student has no enrollments and show modal automatically
    useEffect(() => {
        if (canEnroll && currentUser?._id && !showEnrollmentModal) {
            // Wait a bit for enrollments and courses to load
            const checkAndShowModal = async () => {
                const enrolledCourseIds = enrollments
                    .filter((e) => e.user === currentUser._id)
                    .map((e) => e.course);
                const enrolledCoursesCount = courses.filter((c: any) =>
                    enrolledCourseIds.includes(c._id)
                ).length;
                
                // If no enrolled courses, show modal automatically
                if (enrolledCoursesCount === 0) {
                    if (allAvailableCourses.length === 0) {
                        const all = await client.fetchAllCourses();
                        setAllAvailableCourses(all || []);
                        if (all && all.length > 0) {
                            setShowEnrollmentModal(true);
                        }
                    } else {
                        setShowEnrollmentModal(true);
                    }
                }
            };
            
            // Small delay to ensure enrollments and courses are loaded
            const timer = setTimeout(checkAndShowModal, 300);
            return () => clearTimeout(timer);
        }
    }, [enrollments, courses, canEnroll, currentUser?._id, allAvailableCourses.length]);

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
        // Reload courses to update the display
        await loadCourses();
    };

    const handleEnrollFromModal = async (courseId: string) => {
        await toggleEnrollment(courseId);
    };

    const toggleDescription = (courseId: string) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    const renderDescription = (course: any, maxLength: number = 100) => {
        const courseId = course._id;
        const description = course.description || "No description available";
        const isExpanded = expandedDescriptions[courseId];
        
        if (description.length <= maxLength) {
            return <span>{description}</span>;
        }
        
        if (isExpanded) {
            return (
                <span>
                    {description}
                    <button
                        className="btn btn-link p-0 ms-1"
                        style={{fontSize: "0.9rem", textDecoration: "none"}}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDescription(courseId);
                        }}
                    >
                        ...less
                    </button>
                </span>
            );
        }
        
        return (
            <span>
                {description.substring(0, maxLength)}
                <button
                    className="btn btn-link p-0 ms-1"
                    style={{fontSize: "0.9rem", textDecoration: "none"}}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDescription(courseId);
                    }}
                >
                    ...more
                </button>
            </span>
        );
    };

    /** ------------------------------ FILTERING ---------------------------- **/

    const displayedCourses = (() => {
        if (isFaculty) {
            // Faculty sees courses they created
            return courses;
        } else if (isStudent) {
            // Students only see enrolled courses
            return courses.filter((c) =>
                enrollments.some(
                    (e) => e.user === currentUser._id && e.course === c._id
                )
            );
        }
        return courses;
    })();

    /** ------------------------------ RENDER ------------------------------- **/

    return (
        <div id="wd-dashboard">
            <h1>Dashboard</h1>

            {isFaculty && (
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
                </h5>
            )}

            {canEnroll && (
                <h5>
                    <button
                        className="btn btn-primary float-end"
                        onClick={() => {
                            // Load all courses for the modal
                            client.fetchAllCourses().then((all) => {
                                setAllAvailableCourses(all || []);
                                setShowEnrollmentModal(true);
                            });
                        }}
                    >
                        Enroll in Courses
                    </button>
                </h5>
            )}

            {isFaculty && (
                <>
                    <hr/>
                    <FormControl
                        value={course.name}
                        onChange={(e) =>
                            setCourse({...course, name: e.target.value})
                        }
                        className="mb-2"
                        placeholder="Course Name"
                    />

                    <FormControl
                        value={course.description}
                        onChange={(e) =>
                            setCourse({...course, description: e.target.value})
                        }
                        placeholder="Course Description"
                    />
                    <hr/>
                </>
            )}

            <h2>
                {isFaculty
                    ? `My Courses (${displayedCourses.length})`
                    : canEnroll
                        ? `My Enrolled Courses (${displayedCourses.length})`
                        : `Courses (${displayedCourses.length})`}
            </h2>

            {canEnroll && displayedCourses.length === 0 && (
                <div className="alert alert-info mt-3">
                    <p>You are not enrolled in any courses yet.</p>
                    <p>Click "Enroll in Courses" above to browse and enroll in available courses.</p>
                </div>
            )}

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

                                        <CardText style={{minHeight: "100px", maxHeight: expandedDescriptions[course._id] ? "none" : "100px"}}>
                                            {renderDescription(course, 100)}
                                        </CardText>

                                        <Button variant="primary">Go</Button>

                                        {isFaculty && (course as any).createdBy === currentUser._id && (
                                            <>
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
                                            </>
                                        )}
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Enrollment Modal for Students and Users */}
            {canEnroll && (
                <Modal show={showEnrollmentModal} onHide={() => setShowEnrollmentModal(false)} size="lg">
                    <ModalHeader closeButton>
                        <ModalTitle>Enroll in Courses</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p>Select courses you would like to enroll in:</p>
                        <Row xs={1} md={2} className="g-3">
                            {allAvailableCourses.map((course) => {
                                const isEnrolled = enrollments.some(
                                    (e) => e.user === currentUser._id && e.course === course._id
                                );
                                return (
                                    <Col key={course._id}>
                                        <Card>
                                            <CardBody>
                                                <CardTitle>{course.name}</CardTitle>
                                                <CardText 
                                                    style={{
                                                        minHeight: "80px", 
                                                        maxHeight: expandedDescriptions[course._id] ? "none" : "80px",
                                                        fontSize: "0.9rem"
                                                    }}
                                                >
                                                    {renderDescription(course, 80)}
                                                </CardText>
                                                <Button
                                                    variant={isEnrolled ? "primary" : "success"}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEnrollFromModal(course._id);
                                                    }}
                                                >
                                                    {isEnrolled ? "Unenroll" : "Enroll"}
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                        {allAvailableCourses.length === 0 && (
                            <p className="text-muted">No courses available at this time.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary" onClick={() => setShowEnrollmentModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
}
