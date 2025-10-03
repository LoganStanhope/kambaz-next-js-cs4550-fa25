import {LuNotebookText} from "react-icons/lu";
import {BsGripVertical} from "react-icons/bs";

export default function AssignmentIconButton() {
    return (
        <div className="float-start me-1">
            <BsGripVertical className="me-2 fs-3"/>
            <LuNotebookText style={{ color : "green"}} className="me-2 fs-3"/>
        </div>);
}
