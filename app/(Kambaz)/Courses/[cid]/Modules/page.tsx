export default function Modules() {
    return (
        <div>
            <div id="wd-module-buttons">
                <button>Collapse All</button>
                <button>View Progress</button>
                <select id="wd-publish-all">
                    <option value="All">All</option>
                    <option selected value="PUBALL">
                        Publish All
                    </option>
                </select>
                <button>+ Module</button>
            </div>
            <ul id="wd-modules">
                <li className="wd-module">
                    <div className="wd-title">Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to the course</li>
                                <li className="wd-content-item">Learn what is Web Development</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">READINGS</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Chapter 1: Web Development for Dummies</li>
                                <li className="wd-content-item">Chapter 1: Frontend Development 101</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Creating Kambaz from scratch</li>
                                <li className="wd-content-item">Creating a React Application</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 2, Lecture 2 - Formatting User Interfaces with HTML</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn to create HTML Interfaces</li>
                                <li className="wd-content-item">Understanding HTTP serves with Node.js</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">READINGS</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Chapter 2: Web Development for Dummies</li>
                                <li className="wd-content-item">Chapter 2: Frontend Development 101</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">HTML Breakdown</li>
                                <li className="wd-content-item">Understanding Your IDE</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 3, Lecture 3 - Working with React</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">React 101</li>
                                <li className="wd-content-item">Using CSS with React</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">READINGS</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Chapter 3: Web Development for Dummies</li>
                                <li className="wd-content-item">Chapter 3: Frontend Development 101</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">CSS Workshop</li>
                                <li className="wd-content-item">Walkthrough React Development</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}
