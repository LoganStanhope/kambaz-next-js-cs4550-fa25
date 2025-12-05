'use client';
import {useEffect, useState} from "react";
import {Button, FormControl, InputGroup, ListGroup, ListGroupItem, Offcanvas} from "react-bootstrap";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useParams, useRouter} from "next/navigation";
import InputGroupText from "react-bootstrap/InputGroupText";
import {HiMiniMagnifyingGlassPlus} from "react-icons/hi2";
import {useSelector} from "react-redux";
import Link from "next/link";
import {IoMdArrowDropdown} from "react-icons/io";
import {RxRocket} from "react-icons/rx";
import GreenCheckmark from "@/app/(Kambaz)/Courses/[cid]/Modules/GreenCheckmark";
import {IoEllipsisVertical} from "react-icons/io5";
import {fetchQuizzes, deleteQuiz, saveQuiz} from "@/app/(Kambaz)/Courses/client";

export default function Quizzes() {
    const {cid} = useParams(); // current course id
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const currentUserId = useSelector((state: any) => state.accountReducer.currentUser?._id);
    const router = useRouter();

    // Side panel states
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        if (!cid) return;
        fetchQuizzes(cid)
            .then(setQuizzes)
            .catch(err => console.error("Failed to load quizzes", err));
    }, [cid]);

    function getAvailability(q: any) {
        const now = new Date();
        const availableDate = new Date(q.available_date);
        const availableUntil = new Date(q.available_until);

        if (now < availableDate) return `Not available until ${availableDate.toLocaleString()}`;
        if (now > availableUntil) return "Closed";
        return "Available";
    }

    const handleAddQuiz = () => {
        router.push(`/Courses/${cid}/Quizzes/new`);
    };

    function formatQuizText(quiz: any) {
        const availability = getAvailability(quiz);
        const formatDate = (dateStr: string) => {
            if (!dateStr) return "TBD";
            const date = new Date(dateStr);
            const options: Intl.DateTimeFormatOptions = {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            };
            return date.toLocaleString('en-US', options);
        };

        let latestScoreText = "No attempts";
        if (currentUserId && quiz.student_scores?.[currentUserId]) {
            latestScoreText = `Score: ${quiz.student_scores[currentUserId].last_attempt_score}`;
        }

        return (
            <p className="mb-0">
                <span style={{color: 'red'}}> {availability} </span> |{' '}
                <b> Due </b> {formatDate(quiz.due_date)} | {quiz.points}{' '}pts | {quiz.num_questions}{' '}Questions
                |{' '}
                {latestScoreText}
            </p>
        );
    }

    return (
        <div id="wd-quizzes">
            <div className="d-flex justify-content-between">
                <InputGroup className="mb-6" style={{width: "250px"}}>
                    <InputGroupText>
                        <HiMiniMagnifyingGlassPlus/>
                    </InputGroupText>
                    <FormControl size="lg" type="search" placeholder="Search for Quiz" id="wd-search"/>
                </InputGroup>
                <div>
                    <div>
                        <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">
                            <BsThreeDotsVertical/>
                        </Button>
                        <Button
                            variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment"
                            onClick={handleAddQuiz}
                        >
                            + Quiz
                        </Button>
                    </div>
                </div>
            </div>
            <br/>
            <hr/>
            <br/>

            <ListGroup>
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-4 ps-2 bg-secondary d-flex justify-content-between">
                        <div>
                            <IoMdArrowDropdown className="me-2"/>
                            Assignment Quizzes
                        </div>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {quizzes.map((q: any) => (
                            <ListGroupItem
                                as={Link}
                                key={`${q._id}-${q.name}`}
                                className="wd-lesson p-4 ps-1 flex-column"
                                href={`/Courses/${q.course}/Quizzes/${q._id}`}
                            >
                                <RxRocket className="me-3 ms-3 fs-3 float-start text-success"/>

                                <div className="d-flex flex-column flex-grow-1">
                                    <h3>{q.name}</h3>
                                    <div className="d-flex flex-row justify-content-between">
                                        {formatQuizText(q)}
                                        <div className="d-flex align-items-center">
                                            <GreenCheckmark enable={q.published} />
                                            <IoEllipsisVertical
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSelectedQuiz(q);
                                                    setShowPanel(true);
                                                }}
                                                className="fs-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>

            {/* Side Panel */}
            <Offcanvas show={showPanel} onHide={() => setShowPanel(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{selectedQuiz?.name}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column gap-3">
                    <Button
                        variant="primary"
                        onClick={() => {
                            router.push(`/Courses/${cid}/Quizzes/${selectedQuiz?._id}`);
                            setShowPanel(false);
                        }}
                    >
                        Edit Quiz
                    </Button>

                    <Button
                        variant="danger"
                        onClick={async () => {
                            if (!selectedQuiz) return;
                            await deleteQuiz(cid, selectedQuiz._id);
                            setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
                            setShowPanel(false);
                        }}
                    >
                        Delete Quiz
                    </Button>

                    <Button
                        variant={selectedQuiz?.published ? "secondary" : "success"}
                        onClick={async () => {
                            if (!selectedQuiz) return;
                            const updated = await saveQuiz(cid, selectedQuiz._id, {
                                ...selectedQuiz,
                                published: !selectedQuiz.published,
                            });
                            setQuizzes(quizzes.map(q => q._id === updated._id ? updated : q));
                            setShowPanel(false);
                        }}
                    >
                        {selectedQuiz?.published ? "Unpublish" : "Publish"}
                    </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
