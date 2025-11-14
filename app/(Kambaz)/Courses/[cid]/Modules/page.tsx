"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ModulesControls from "@/app/(Kambaz)/Courses/[cid]/Modules/ModulesControls";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import { setModules, editModule, updateModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import * as client from "../../client";

export default function Modules() {
    const { cid } = useParams();
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const dispatch = useDispatch();

    const [moduleName, setModuleName] = useState("");
    const [editingModule, setEditingModule] = useState<{ _id: string; name: string } | null>(null);

    const fetchModules = async () => {
        if (!cid) return;
        const fetchedModules = await client.findModulesForCourse(cid as string);
        dispatch(setModules(fetchedModules));
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const onCreateModuleForCourse = async () => {
        if (!cid || !moduleName.trim()) return;
        const newModule = { name: moduleName, course: cid };
        const module = await client.createModuleForCourse(cid as string, newModule);
        dispatch(setModules([...modules, module]));
        setModuleName("");
    };

    const onRemoveModule = async (moduleId: string) => {
        await client.deleteModule(moduleId);
        dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    };

    const onUpdateModule = async (module: any) => {
        await client.updateModule(module);
        const newModules = modules.map((m: any) => (m._id === module._id ? module : m));
        dispatch(setModules(newModules));
    };

    const startEditing = (module: any) => {
        dispatch(editModule(module._id));
        setEditingModule({ _id: module._id, name: module.name });
    };

    return (
        <div>
            <div id="wd-module-buttons" className="me-5">
                <ModulesControls
                    moduleName={moduleName}
                    setModuleName={setModuleName}
                    addModule={onCreateModuleForCourse}
                />
                <br /><br /><br />
            </div>

            <ListGroup className="rounded-0 me-5" id="wd-modules">
                {modules.map((module: any) => (
                    <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-2 bg-secondary">
                            <BsGripVertical className="me-2 fs-3" />

                            {!module.editing && module.name}

                            {module.editing && editingModule && editingModule._id === module._id && (
                                <FormControl
                                    className="w-50 d-inline-block"
                                    value={editingModule.name}
                                    onChange={(e) =>
                                        setEditingModule({ ...editingModule, name: e.target.value })
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            onUpdateModule({ ...module, name: editingModule.name, editing: false });
                                            setEditingModule(null);
                                        }
                                    }}
                                />
                            )}

                            <ModuleControlButtons
                                moduleId={module._id}
                                deleteModule={() => onRemoveModule(module._id)}
                                editModule={() => startEditing(module)}
                            />
                        </div>

                        {module.lessons && (
                            <ListGroup className="wd-lessons rounded-0">
                                {module.lessons.map((lesson: { _id: string; name: string }) => (
                                    <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                        <BsGripVertical className="me-2 fs-3" />
                                        {lesson.name}
                                        <LessonControlButtons
                                            assignmentId={lesson._id}
                                            deleteAssignment={() => console.log("deleteLesson not implemented yet")}
                                        />
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
