"use client";
import {ReactNode, useState} from "react";
import CourseNavigation from "./Navigation";
import {FaAlignJustify} from "react-icons/fa6";
import Breadcrumb from "@/app/(Kambaz)/Courses/[cid]/BreadCrumb";
import {useSelector} from "react-redux";
import {useParams} from "next/navigation";

export default function CoursesLayout({children}: { children: ReactNode }) {
    const {cid} = useParams();
    const {courses} = useSelector((state: any) => state.coursesReducer);
    const [showNav, setShowNav] = useState<boolean>(true)
    const course = courses.find((course: any) => course._id === cid);
    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1 ms-4" onClick={() => {
                    setShowNav(!showNav)
                }}/>
                <Breadcrumb course={course}/>
            </h2>
            <hr/>

            <div className="d-flex">
                <div className="d-none d-md-block">
                    {showNav ? <CourseNavigation cid={cid}/> : <div></div>}
                </div>
                <div className="flex-fill">{children}</div>
            </div>
        </div>
    );
}
