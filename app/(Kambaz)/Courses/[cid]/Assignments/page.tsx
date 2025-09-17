import Link from "next/link";

export default async function Assignments({params,}:
                                              { params: Promise<{ cid: string }>; }) {
    const {cid} = await params;
    return (
        <div id="wd-assignments">
            <input placeholder="Search for Assignments"
                   id="wd-search-assignment"/>
            <button id="wd-add-assignment-group">+ Group</button>
            <button id="wd-add-assignment">+ Assignment</button>
            <div>
                <h3 id="wd-assignments-title">
                    ASSIGNMENTS 40% of Total <button>+</button></h3>
                <ul id="wd-assignment-list">
                    <li className="wd-assignment-list-item">
                        <Link href={`/Courses/${cid}/Assignments/A1 - ENV + HTML`} id="wd-assignment-link">A1 - ENV + HTML</Link>
                    </li>
                    <div className="wd-assignment-list-item" id="wd-assignment-link">
                        Multiple Modules | <b>Not available until</b> May 6 at 12:00am |<br/>
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </div>
                    <li className="wd-assignment-list-item">
                        <Link href={`/Courses/${cid}/Assignments/A2 - CSS + BOOTSTRAP`} id="wd-assignment-link">A2 - CSS +
                            BOOTSTRAP</Link></li>
                    <div className="wd-assignment-list-item" id="wd-assignment-link">
                        Multiple Modules | <b>Not available until</b> May 13 at 12:00am |<br/>
                        <b>Due</b> May 20 at 11:59pm | 100pts
                    </div>
                    <li className="wd-assignment-list-item">
                        <Link href={`/Courses/${cid}/Assignments/A3 - JAVASCRIPT + REACT`} id="wd-assignment-link">A3 - JAVASCRIPT +
                            REACT</Link></li>
                    <div className="wd-assignment-list-item" id="wd-assignment-link">
                        Multiple Modules | <b>Not available until</b> May 20 at 12:00am |<br/>
                        <b>Due</b> May 27 at 11:59pm | 100pts
                    </div>
                </ul>
            </div>
        </div>
    );
}
