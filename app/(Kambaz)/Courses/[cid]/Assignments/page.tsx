import './styles.css';
import {Button, FormControl, InputGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import {HiMiniMagnifyingGlassPlus} from "react-icons/hi2";
import InputGroupText from "react-bootstrap/InputGroupText";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import AssignmentButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentButton";
import AssignmentEditButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentEditButton";
import AssignmentIconButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentIconButton";
import Link from "next/link";

export default async function Assignments({params,}:
                                              { params: Promise<{ cid: string }>; }) {
    const {cid} = await params;
    return (
        <div id="wd-assignments">
            <div className="d-flex justify-content-between">
                <InputGroup className="mb-6" style={{width: "250px"}}>
                    <InputGroupText>
                        <HiMiniMagnifyingGlassPlus/>
                    </InputGroupText>
                    <FormControl size="lg" type="search" placeholder="Search..." id="wd-search"/>
                </InputGroup>
                <div>
                    <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment">+
                        Assignment</Button>
                    <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">+
                        Group</Button>
                </div>
            </div>
            <br/><br/><br/><br/>

            <ListGroup>
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between">
                        <div>
                            <AssignmentButton/>
                            ASSIGNMENTS
                        </div>
                        <AssignmentEditButton/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem as={Link}
                                       href={`/Courses/${cid}/Assignments/A1 - ENV + HTML`}
                                       className="wd-lesson p-4 ps-1 flex-column">
                            <AssignmentIconButton/>
                            <div className="d-flex flex-column flex-grow-1">
                                <h3>A1</h3>
                                <div className="d-flex flex-row justify-content-between">
                                    <p className="mb-0">
                                        <span style={{color: 'red'}}> Multiple Modules </span>
                                        | <b>Not available until </b> May 6 at 12:00am |<br/>
                                        <b> Due </b> May 13 at 11:59pm | 100pts
                                    </p>
                                    <LessonControlButtons/>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem as={Link}
                                       href={`/Courses/${cid}/Assignments/A2 - CSS + BOOTSTRAP`}
                                       className="wd-lesson p-4 ps-1 flex-column">
                            <AssignmentIconButton/>
                            <div className="d-flex flex-column flex-grow-1">
                                <h3>A2</h3>
                                <div className="d-flex flex-row justify-content-between">
                                    <p className="mb-0">
                                        <span style={{color: 'red'}}> Multiple Modules </span>
                                        | <b>Not available until </b> May 13 at 12:00am |<br/>
                                        <b> Due </b> May 20 at 11:59pm | 100pts
                                    </p>
                                    <LessonControlButtons/>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem as={Link}
                                       href={`/Courses/${cid}/Assignments/A3 - JAVASCRIPT + REACT`}
                                       className="wd-lesson p-4 ps-1 flex-column">
                            <AssignmentIconButton/>
                            <div className="d-flex flex-column flex-grow-1">
                                <h3>A3</h3>
                                <div className="d-flex flex-row justify-content-between">
                                    <p className="mb-0">
                                        <span style={{color: 'red'}}> Multiple Modules </span>
                                        | <b>Not available until </b> May 20 at 12:00am |<br/>
                                        <b> Due </b> May 27 at 11:59pm | 100pts
                                    </p>
                                    <LessonControlButtons/>
                                </div>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
