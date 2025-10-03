import {IoMdArrowDropdown} from "react-icons/io";
import {BsGripVertical} from "react-icons/bs";

export default function AssignmentButton() {
    return (
        <div className="float-start me-1">
            <BsGripVertical className="me-2 fs-3"/>
            <IoMdArrowDropdown/>
        </div>);
}
