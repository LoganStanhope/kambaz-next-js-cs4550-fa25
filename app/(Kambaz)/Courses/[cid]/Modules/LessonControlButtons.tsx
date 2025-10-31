import {IoEllipsisVertical} from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import {FaTrash} from "react-icons/fa";
import {deleteAssignment} from "@/app/(Kambaz)/Courses/[cid]/Assignments/reducer";
import {useSelector} from "react-redux";

export default function LessonControlButtons(
    {assignmentId, deleteAssignment}: {
        assignmentId: string;
        deleteAssignment: (assignmentId: string) => void;
    }) {
    const currentUserRole = useSelector((state: any) => state.accountReducer.currentUser?.role);
    return (
        <div className="float-end">
            <GreenCheckmark/>
            <IoEllipsisVertical className="fs-4"/>
            {currentUserRole == "STUDENT" ? <div></div> :
                <FaTrash
                    className="text-danger me-2 mb-1"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteAssignment(assignmentId)
                    }
                    }/>
            }
        </div>);
}

