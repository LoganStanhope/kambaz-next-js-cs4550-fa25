import {IoEllipsisVertical} from "react-icons/io5";
import {FaPlus} from "react-icons/fa6";

export default function AssignmentEditButton() {
    return (
        <div className="float-end">
            <span className="rounded-circle border px-3 py-3 text-center me-2">40% of Total</span>
            <FaPlus className="me-2"/>
            <IoEllipsisVertical className="fs-4"/>
        </div>);
}

