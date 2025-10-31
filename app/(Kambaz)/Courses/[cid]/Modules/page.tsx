"use client"
import {v4 as uuidv4} from "uuid";
import {useState} from "react";
import {useParams} from "next/navigation";
import * as db from "../../../Database";
import ModulesControls from "@/app/(Kambaz)/Courses/[cid]/Modules/ModulesControls";
import {FormControl, ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import {addModule, editModule, updateModule, deleteModule}
    from "./reducer";
import {useSelector, useDispatch} from "react-redux";

export default function Modules() {
    const {cid} = useParams();
    const [moduleName, setModuleName] = useState("");
    const {modules} = useSelector((state: any) => state.modulesReducer);
    const dispatch = useDispatch();

    return (
        <div>
            <div id="wd-module-buttons" className="me-5">
                <ModulesControls setModuleName={setModuleName}
                                 moduleName={moduleName}
                                 addModule={() => {
                                     dispatch(addModule({name: moduleName, course: cid}));
                                     setModuleName("");
                                 }}/>
                <br/><br/><br/>
            </div>
            <ListGroup className="rounded-0 me-5" id="wd-modules">
                {modules
                    .filter((module) => module.course === cid)
                    .map((module) => (
                        <ListGroupItem key={`${module._id}-${module.name}`}
                                       className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div key={module._id} className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical key={module._id} className="me-2 fs-3"/>
                                {!module.editing && module.name}
                                {module.editing && (
                                    <FormControl className="w-50 d-inline-block"
                                                 onChange={(e) => dispatch(updateModule({
                                                     ...module,
                                                     name: e.target.value
                                                 }))}
                                                 onKeyDown={(e) => {
                                                     if (e.key === "Enter") {
                                                         dispatch(updateModule({...module, editing: false}));
                                                     }
                                                 }}
                                                 defaultValue={module.name}/>
                                )}
                                <ModuleControlButtons key={`${module._id}-${module.name}`} moduleId={module._id}
                                                      deleteModule={(moduleId) => {
                                                          dispatch(deleteModule(moduleId));
                                                      }}
                                                      editModule={(moduleId) => dispatch(editModule(moduleId))}/>
                            </div>
                            {module.lessons && (
                                <ListGroup key={`${module._id}-${module.name}`} className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson) => (
                                        <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                            <BsGripVertical key={module._id} className="me-2 fs-3"/> {lesson.name}
                                            <LessonControlButtons key={`${module._id}-${module.name}`}/>
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
