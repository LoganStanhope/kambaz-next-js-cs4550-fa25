"use client"
import {useParams} from "next/navigation";
import * as db from "../../../Database";
import ModulesControls from "@/app/(Kambaz)/Courses/[cid]/Modules/ModulesControls";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";

export default function Modules() {
    const {cid} = useParams();
    const modules = db.modules;
    return (
        <div>
            <div id="wd-module-buttons" className="me-5">
                <ModulesControls/><br/><br/><br/>
            </div>
            <ListGroup className="rounded-0 me-5" id="wd-modules">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3"/> {module.name}
                                <ModuleControlButtons/>
                            </div>
                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson: any) => (
                                        <ListGroupItem className="wd-lesson p-3 ps-1">
                                            <BsGripVertical className="me-2 fs-3"/> {lesson.name}
                                            <LessonControlButtons/>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    ))}
            </ListGroup>
        </div>
    );
}
