'use client';
import './styles.css';
import {Button, FormControl, InputGroup, ListGroup, ListGroupItem} from "react-bootstrap";
import {HiMiniMagnifyingGlassPlus} from "react-icons/hi2";
import InputGroupText from "react-bootstrap/InputGroupText";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import AssignmentButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentButton";
import AssignmentEditButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentEditButton";
import AssignmentIconButton from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentIconButton";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {deleteAssignment} from "@/app/(Kambaz)/Courses/[cid]/Assignments/reducer";

export default function Assignments() {
    function formatAssignmentText(assignment: any) {
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
                <span style={{color: 'red'}}> Multiple Modules </span> |{' '}
                <b>Not available until </b> {formatDate(assignment.available_date)} |<br/>
                <b> Due </b> {formatDate(assignment.due_date)} | {assignment.points}pts
            </p>
        );
    }

    const {cid} = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const {assignments} = useSelector((state: any) => state.assignmentsReducer);
    const handleAddAssignment = () => {
        router.push(`/Courses/${cid}/Assignments/Editor`);
    };
    const currentUserRole = useSelector((state: any) => state.accountReducer.currentUser?.role);

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
                    {currentUserRole == "STUDENT" ? <div></div> :
                        <div>
                            <Button onClick={handleAddAssignment}
                                    variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment">+
                                Assignment</Button>
                            <Button variant="secondary" size="lg" className="me-1 float-end"
                                    id="wd-add-assignment-group">+
                                Group</Button></div>
                    }
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
                        {assignments
                            .filter(a => a.course === cid)
                            .map(a => (
                                <ListGroupItem as={currentUserRole == "STUDENT" ? "span" : Link}
                                               key={a._id}
                                               href={`/Courses/${a.course}/Assignments/${a._id}`}
                                               className="wd-lesson p-4 ps-1 flex-column">
                                    <AssignmentIconButton/>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <h3>{a._id}</h3>
                                        <div className="d-flex flex-row justify-content-between">
                                            {formatAssignmentText(a)}
                                            <LessonControlButtons
                                                key={`${a._id}-${a.title}`}
                                                assignmentId={a._id}
                                                deleteAssignment={(assignmentId) => {
                                                    dispatch(deleteAssignment(assignmentId))
                                                }}
                                            />
                                        </div>
                                    </div>
                                </ListGroupItem>
                            ))}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
