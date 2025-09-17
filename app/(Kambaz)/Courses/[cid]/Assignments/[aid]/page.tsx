export default async function AssignmentEditor({params,}:
                                                   { params: Promise<{ aid: string }>; }) {
    const {aid} = await params;
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label>
            <input id="wd-name" value={`${aid}`}/><br/><br/>
            <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
            <br/>
            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" value={100}/>
                    </td>
                </tr>
                {/* wd-points, wd-group, wd-display-grade-as, wd-submission-type, wd-text-entry, wd-website-url
                		wd-media-recordings, wd-student-annotation,wd-file-upload, wd-assign-to, wd-due-date,
                		wd-available-from, wd-available-until, wd-name */}
            </table>
        </div>
    );
}
