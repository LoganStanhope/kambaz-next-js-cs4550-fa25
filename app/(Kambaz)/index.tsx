import {Routes, Route, Navigate} from "react-router";
import Assignments from "@/app/(Kambaz)/Courses/[cid]/Assignments/page";
import Modules from "@/app/(Kambaz)/Courses/[cid]/Modules/page";
import Home from "@/app/(Kambaz)/Courses/[cid]/Home/page";
import Quizzes from "@/app/(Kambaz)/Courses/[cid]/Quizzes/page";
import Zoom from "@/app/(Kambaz)/Courses/[cid]/Zoom/page";
import Piazza from "@/app/(Kambaz)/Courses/[cid]/Piazza/page";
import PeopleTable from "@/app/(Kambaz)/Courses/[cid]/People/page";
import {useSelector} from "react-redux";
import {RootState} from "@/app/(Kambaz)/store";

export default function Kambaz({params,}:
                                   { params: Promise<{ cid: string, aid: string }>; }) {
    const {currentUser} = useSelector((state: RootState) => state.accountReducer);
    // @ts-expect-error don't need the error
    const showAdmin = currentUser?.role === "ADMIN";
    return (
        <div id="wd-kambaz">
            <h1>Kambaz</h1>
            <Routes>
                <Route path="/" element={<Navigate to="Home"/>}/>
                <Route path="Home" element={<Home/>}/>
                <Route path="Modules" element={<Modules/>}/>
                <Route path="Assignments" element={<Assignments/>}/>
                <Route path="Piazza" element={<Piazza/>}/>
                <Route path="Zoom" element={<Zoom/>}/>
                <Route path="Quizzes" element={<Quizzes/>}/>
                <Route path="People" element={<PeopleTable/>}/>
                {showAdmin && <Route path="Users" element={<PeopleTable/>}/>}
            </Routes>
        </div>
    );
}
