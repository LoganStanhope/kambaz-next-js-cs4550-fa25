import ModulesControls from "@/app/(Kambaz)/Courses/[cid]/Modules/ModulesControls";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";

export default function Modules() {
    return (
        <div>
            <div id="wd-module-buttons" className="me-5">
                <ModulesControls/><br/><br/><br/>
            </div>
            <ListGroup className="rounded-0 me-5" id="wd-modules">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3"/> Week 1, Lecture 1 - Course Introduction, Syllabus,
                        Agenda <ModuleControlButtons/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            LEARNING OBJECTIVES
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Introduction to the course
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Learn what is Web Development
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            READINGS
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 1: Web Development for Dummies
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 1: Frontend Development 101
                            <LessonControlButtons/>
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3"/> Week 2, Lecture 2 - Formatting User Interface
                        with HTML <ModuleControlButtons/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            LEARNING OBJECTIVES
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Understanding HTTP serves with Node.js
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Creating Kambaz
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            READINGS
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 2: Web Development for Dummies
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 2: Frontend Development 101
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            SLIDES
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            HTML Breakdown
                            <LessonControlButtons/>
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3"/> Week 3, Lecture 3 - Working with React
                        <ModuleControlButtons/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            LEARNING OBJECTIVES
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            React 101
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Using CSS with React
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            READINGS
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 3: Web Development for Dummies
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Chapter 3: Frontend Development 101
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            SLIDES
                            <LessonControlButtons/>
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3"/>
                            Walkthrough React Development
                            <LessonControlButtons/>
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
