'use client';
import {useEffect, useState} from "react";
import {Button, FormControl, InputGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import {BsThreeDotsVertical} from "react-icons/bs";
import quizzesData from "../../../Database/quizzes.json";
import {useParams} from "next/navigation";
import InputGroupText from "react-bootstrap/InputGroupText";
import {HiMiniMagnifyingGlassPlus} from "react-icons/hi2";
import {useSelector} from "react-redux";
import Link from "next/link";
import {IoMdArrowDropdown} from "react-icons/io";
import {RxRocket} from "react-icons/rx";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import GreenCheckmark from "@/app/(Kambaz)/Courses/[cid]/Modules/GreenCheckmark";
import {IoEllipsisVertical} from "react-icons/io5";

export default function Quizzes() {
    const {cid} = useParams(); // current course id
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const currentUserRole = useSelector((state: any) => state.accountReducer.currentUser?.role);

    useEffect(() => {
        if (!cid) return;
        // Filter quizzes by course id
        const filtered = quizzesData.filter(q => q.course === cid);
        setQuizzes(filtered);
    }, [cid]);

    if (!cid) {
        return <p>Loading course quizzes...</p>;
    }

    function getAvailability(q: any) {
        const now = new Date();
        const availableDate = new Date(q.available_date);
        const availableUntil = new Date(q.available_until);

        if (now < availableDate) {
            return `Not available until ${availableDate.toLocaleString()}`;
        }

        if (now > availableUntil) {
            return "Closed";
        }

        return "Available";
    }
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
        return (
            <p className="mb-0">
                <span style={{color: 'red'}}> {availability} </span> |{' '}
                <b> Due </b> {formatDate(quiz.due_date)} | {quiz.points}{' '}pts | {quiz.num_questions}{' '}Questions
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
                        <Button variant="secondary" size="lg" className="me-1 float-end"
                                id="wd-add-assignment-group">
                            <BsThreeDotsVertical/>
                        </Button>
                        <Button
                            variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment">+
                            Quiz</Button>
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
                        {quizzes.map((q: any) => {
                            const availability = getAvailability(q);

                            return (
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
                                                <GreenCheckmark
                                                    enabled={availability === "Available"}
                                                />
                                                <IoEllipsisVertical className="fs-4"/>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
