export default async function AssignmentEditor({params,}:
                                                   { params: Promise<{ aid: string }>; }) {
    const {aid} = await params;
    const decodedAid = decodeURIComponent(aid);
    return (
        <form id="wd-assignments-editor">
            <h3>Assignment Name</h3>
            <input id="wd-name" value={decodedAid}/><br/><br/>
            <textarea id="wd-description" cols={40} rows={10}>
        The assignment is available online Submit a link to the landing page of your Web application running on Vercel.
                The landing page should include that following: Your fill name and section Links to each of the lab
                assignments Link to the Kambaz application Links to all relevant source code repositories. The Kambaz
                application should include a link to navigate back to the landing page.
      </textarea>
            <br/>
            <table>
                <tbody>
                <tr>
                    <td>
                        <label htmlFor="wd-points">Points </label>
                        <input id="wd-points" value={100}/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label htmlFor="wd-points">Assignment Group </label>
                        <select id="wd-group">
                            <option value="QUIZZES">QUIZZES</option>
                            <option selected value="ASSIGNMENTS">
                                ASSIGNMENTS
                            </option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECTS">PROJECTS</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="wd-points">Display Grade as </label>
                        <select id="wd-group">
                            <option value="LETTER">Letter</option>
                            <option selected value="Percentage">
                                Percentage
                            </option>
                        </select>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label htmlFor="wd-points">Submission Type </label>
                        <select id="wd-group">
                            <option value="INPERSON">In-person</option>
                            <option selected value="Online">
                                Online
                            </option>
                        </select>
                    </td>
                </tr>
                <br/>
                <tr>
                    <td>
                        <label htmlFor="wd-entry-types">Online Entry Option </label><br/>
                        <input type="checkbox" name="check-online-entry" id="wd-text-entry"/>
                        <label htmlFor="wd-text-entry">Text Entry</label><br/>
                        <input type="checkbox" name="check-website-url" id="wd-website-url"/>
                        <label htmlFor="wd-website-url">Website URL</label><br/>
                        <input type="checkbox" name="check-media-recordings" id="wd-media-recordings"/>
                        <label htmlFor="wd-media-recordings">Media Recording</label><br/>
                        <input type="checkbox" name="check-student-annotation" id="wd-student-annotation"/>
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br/>
                        <input type="checkbox" name="check-file-upload" id="wd-file-upload"/>
                        <label htmlFor="wd-file-upload">File Uploads</label><br/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label htmlFor="wd-assign-to">Assign to </label><br/>
                        <input id="wd-assign-to" defaultValue={"Everyone"}/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label htmlFor="wd-due-date">Due </label><br/>
                        <input value="2025-01-21" type="date" id="wd-due-date"/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label htmlFor="wd-available-from">Available from </label><br/>
                        <input value="2025-01-01" type="date" id="wd-available-from"/>
                    </td>
                    <td>
                        <label htmlFor="wd-available-until">Until </label><br/>
                        <input value="2025-01-31" type="date" id="wd-available-until"/>
                    </td>
                </tr>

                </tbody>
                {/* wd-points, wd-group, wd-display-grade-as, wd-submission-type, wd-text-entry, wd-website-url
                		wd-media-recordings, wd-student-annotation,wd-file-upload, wd-assign-to, wd-due-date,
                		wd-available-from, wd-available-until, wd-name */}
            </table>
            <br/>
            <div>
                <button type="submit" id="wd-save">
                    Save
                </button>
                <button type="button" id="wd-cancel">
                    Cancel
                </button>
            </div>
        </form>
    );
}
