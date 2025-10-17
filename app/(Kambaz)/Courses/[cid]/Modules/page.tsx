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
                    .filter((module) => module.course === cid)
                    .map((module) => (
                        <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div key={module._id} className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical key={module._id} className="me-2 fs-3"/> {module.name}
                                <ModuleControlButtons key={module._id}/>
                            </div>
                            {module.lessons && (
                                <ListGroup key={module._id} className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson) => (
                                        <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                            <BsGripVertical key={module._id} className="me-2 fs-3"/> {lesson.name}
                                            <LessonControlButtons key={module._id}/>
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
