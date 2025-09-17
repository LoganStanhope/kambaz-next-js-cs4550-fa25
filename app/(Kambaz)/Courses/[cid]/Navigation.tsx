import Link from "next/link";

export default async function CourseNavigation({params,}:
                                                   { params: Promise<{ cid: string }>; }) {
    const {cid} = await params;
    return (
        <div id="wd-courses-navigation">
            <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link">Home</Link><br/>
            <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link">Modules
            </Link><br/>
            <Link href={`/Courses/${cid}/Piazza`} id="wd-course-piazza-link">Piazza</Link><br/>
            <Link href={`/Courses/${cid}/Zoom`} id="wd-course-zoom-link">Zoom</Link><br/>
            <Link href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link">
                Assignments</Link><br/>
            <Link href={`/Courses/${cid}/Quizzes`} id="wd-course-quizzes-link">Quizzes
            </Link><br/>
            <Link href={`/Courses/${cid}/Grades`} id="wd-course-grades-link">Grades</Link><br/>
            <Link href={`/Courses/${cid}/People/Table`} id="wd-course-people-link">People</Link><br/>
        </div>
    );
}
