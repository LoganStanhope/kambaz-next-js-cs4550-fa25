'use client';
import '../styles.css';
import {Button, Col, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row} from "react-bootstrap";
import {AiFillCalendar} from "react-icons/ai";
import InputGroupText from "react-bootstrap/InputGroupText";
import React from "react";
import {useParams} from "next/navigation";
import {assignments} from "../../../../Database";
import Link from "next/link";

export default function AssignmentEditor() {
    const {cid, aid} = useParams();
    const assignment = assignments.find((a) => a.course === cid && a._id === aid);
    return (
        <div id="wd-assignments-editor" className="d-flex flex-column justify-content-end">
            <div>
                <h3>Assignment Name</h3>
                <FormGroup as={Row} className="mb-3" controlId="email1">
                    <Col sm={20}>
                        <FormControl type="email" value={assignment?._id}/>
                    </Col>
                </FormGroup> <br/>
                <div className="assignment-text border rounded p-3">
                    <p>This assignment is <span style={{color: 'red'}}>available online</span></p>
                    <p>Submit a link to the landing page of your Web application running on Vercel.</p>
                    The landing page should include the following:<br/><br/>
                    <ul>
                        <li>Your full name and section</li>
                        <li>Links to each of the lab assignments</li>
                        <li>Link to the Kanbas application</li>
                        <li>Links to all relevant source code repositories</li>
                    </ul>
                    The Kanbas application should include a link to navigate back to the landing page.<br/><br/>
                    Assignment Description: {assignment?.description}
                </div>
                <br/>
            </div>

            <div>
                <FormGroup as={Row} className="mb-3">
                    <FormLabel column sm={2}>
                        Points
                    </FormLabel>
                    <Col sm={10}>
                        <FormControl defaultValue={assignment?.points}/>
                    </Col>
                </FormGroup>
            </div>
            <div>
                <FormGroup as={Row} className="mb-3">
                    <FormLabel column sm={2}>
                        Assignment Group
                    </FormLabel>
                    <Col sm={10}>
                        <FormSelect>
                            <option selected>ASSIGNMENTS</option>
                            <option value="1">QUIZZES</option>
                            <option value="2">EXAMS</option>
                            <option value="3">LABS</option>
                        </FormSelect>
                    </Col>
                </FormGroup>
            </div>
            <div>
                <FormGroup as={Row} className="mb-3">
                    <FormLabel column sm={2}>
                        Display Grade as
                    </FormLabel>
                    <Col sm={10}>
                        <FormSelect>
                            <option selected>Percentage</option>
                            <option value="1">Letter</option>
                        </FormSelect>
                    </Col>
                </FormGroup>
            </div>
            <div>
                <FormGroup as={Row} className="mb-3">
                    <FormLabel column sm={2}>
                        Submission Type
                    </FormLabel>
                    <Col className="assignment-text border rounded p-3" sm={10}>
                        <FormSelect>
                            <option selected>Online</option>
                            <option value="1">In-person</option>
                        </FormSelect><br/>
                        <b>Online Entry Options</b><br/>
                        <FormCheck type="checkbox" checked={false}
                                   label="Text Entry"/>
                        <FormCheck type="checkbox" checked={true}
                                   label="Website URL"/>
                        <FormCheck type="checkbox" checked={false}
                                   label="Media Recordings"/>
                        <FormCheck type="checkbox" checked={false}
                                   label="Submission Annotation"/>
                        <FormCheck type="checkbox" checked={false}
                                   label="File Uploads"/>
                    </Col>
                </FormGroup>
            </div>
            <div>
                <FormGroup as={Row} className="mb-3">
                    <FormLabel column sm={2}>
                        Assign
                    </FormLabel>
                    <Col className="assignment-text border rounded p-3" sm={10}>
                        <b>Assign to</b><br/>
                        <FormGroup as={Row} className="mb-3" controlId="assignTo">
                            <Col sm={20}>
                                <FormControl value="Everyone"/>
                            </Col>
                        </FormGroup>
                        <b>Due</b><br/>
                        <InputGroup className="mb-3">
                            <FormControl type="date" size="lg" value={assignment?.due_date} id="wd-search"/>
                            <InputGroupText>
                                <AiFillCalendar/>
                            </InputGroupText>
                        </InputGroup>
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <b>Available from</b>
                                <InputGroup className="mb-3">
                                    <FormControl type="date" size="lg" value={assignment?.available_date}
                                                 id="wd-search"/>
                                    <InputGroupText>
                                        <AiFillCalendar/>
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                            <div className="d-flex flex-column">
                                <b>Until</b>
                                <InputGroup className="mb-3">
                                    <FormControl type="date" size="lg" placeholder="" id="wd-search"/>
                                    <InputGroupText>
                                        <AiFillCalendar/>
                                    </InputGroupText>
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                </FormGroup><br/>
                <hr/>
            </div>
            <div className="d-flex gap-2 f" style={{width: "120px"}}>
                <Button variant="secondary" size="lg" href={"./"}> Cancel </Button>
                <Button variant="danger" size="lg" href={"./"}>Save </Button>
            </div>
        </div>
    );
}
