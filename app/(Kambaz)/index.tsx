import {Routes, Route, Navigate} from "react-router";
import Assignments from "@/app/(Kambaz)/Courses/[cid]/Assignments/page";
import Modules from "@/app/(Kambaz)/Courses/[cid]/Modules/page";
import Home from "@/app/(Kambaz)/Courses/[cid]/Home/page";

export default async function Kambaz({params,}:
                                         { params: Promise<{ cid: string }>; }) {
    await params;
    return (
        <div id="wd-kambaz">
            <h1>Kambaz</h1>
            <Routes>
                <Route path="/" element={<Navigate to="Home"/>}/>
                <Route path="Home" element={<Home/>}/>
                <Route path="Modules" element={<Modules/>}/>
                <Route path="Assignments" element={<Assignments params={params}/>}/>
            </Routes>
        </div>
    );
}
