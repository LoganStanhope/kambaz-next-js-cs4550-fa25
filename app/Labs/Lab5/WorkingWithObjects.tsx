'use client';
import React, {useState} from "react";
import {FormControl, ListGroupItem} from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 80,
    });
    const [module, setModule] = useState({
        id: "modId1", name: "Module Week 1",
        description: "Module: Course Overview",
        due: "Web Development"
    });
    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <hr/>
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/assignment/title`}>
                Get Title
            </a>
            <hr/>
            <h4>Modifying Properties</h4>
            <a id="wd-update-assignment-title"
               className="btn btn-primary float-end"
               href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                Update Title </a>
            <FormControl className="w-75" id="wd-assignment-title"
                         defaultValue={assignment.title} onChange={(e) =>
                setAssignment({...assignment, title: e.target.value})}/>
            <hr/>

            <a id="wd-retrieve-modules" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/module`}>
                Get Module
            </a><br/><br/>
            <a id="wd-retrieve-module-name" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/module/name`}>
                Get Module Name
            </a><br/><br/>
            <a id="wd-update-module-name"
               className="btn btn-primary float-end"
               href={`${MODULE_API_URL}/name/${module.name}`}>
                Update Module Name </a>
            <FormControl className="w-75" id="wd-module-name"
                         defaultValue={module.name} onChange={(e) =>
                setModule({...module, name: e.target.value})}/><br/><br/>
            <div className="d-flex align-items-center justify-content-between">
                <FormControl className="w-75" id="wd-module-name"
                             defaultValue={module.description} onChange={(e) =>
                    setModule({...module, description: e.target.value})}/>
                <a id="wd-update-module-description"
                   className="btn btn-primary float-end"
                   href={`${MODULE_API_URL}/name/${module.description}`}>
                    Update Module Description </a>
            </div>
            <br/><br/>
            <div className="d-flex align-items-center justify-content-between">
                <FormControl className="w-75" id="wd-assignment-score"
                             defaultValue={assignment.score} onChange={(e) =>
                    setAssignment({...assignment, score: parseInt(e.target.value)})}/>
                <a id="wd-update-assignment-score"
                   className="btn btn-primary float-end"
                   href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                    Update Assignment Score </a>
            </div><br/>
            <div className="d-flex align-items-center gap-2">
                <input
                    onChange={() => setAssignment({...assignment, completed: !assignment.completed})}
                    type="checkbox"
                    defaultChecked={assignment.completed}
                    style={{width: "24px", height: "24px"}}/>
                <a id="wd-assignment-completed" className="btn btn-primary"
                   href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
                >
                    Completed?
                </a>
            </div>
            <hr/>
        </div>
    );
}
