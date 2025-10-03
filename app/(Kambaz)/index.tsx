import {Routes, Route, Navigate} from "react-router";
import Assignments from "@/app/(Kambaz)/Courses/[cid]/Assignments/page";
import Modules from "@/app/(Kambaz)/Courses/[cid]/Modules/page";
import Home from "@/app/(Kambaz)/Courses/[cid]/Home/page";
import Quizzes from "@/app/(Kambaz)/Courses/[cid]/Quizzes/page";
import Zoom from "@/app/(Kambaz)/Courses/[cid]/Zoom/page";
import Piazza from "@/app/(Kambaz)/Courses/[cid]/Piazza/page";
import PeopleTable from "@/app/(Kambaz)/Courses/[cid]/People/page";

export default async function Kambaz({params,}:
                                         { params: Promise<{ cid: string, aid: string }>; }) {
    const {cid} = await params;
    const {aid} = await params;
    return (
        <div id="wd-kambaz">
            <h1>Kambaz</h1>
            <Routes>
                <Route path="/" element={<Navigate to="Home"/>}/>
                <Route path="Home" element={<Home/>}/>
                <Route path="Modules" element={<Modules/>}/>
                <Route path="Assignments" element={<Assignments params={params}/>}/>
                <Route path="Piazza" element={<Piazza/>}/>
                <Route path="Zoom" element={<Zoom/>}/>
                <Route path="Quizzes" element={<Quizzes/>}/>
                <Route path="People" element={<PeopleTable />} />
            </Routes>
        </div>
    );
}
