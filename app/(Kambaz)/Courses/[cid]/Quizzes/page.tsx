'use client';
import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import quizzesData from "../../../Database/quizzes.json";
import {useParams} from "next/navigation";

export default function Quizzes() {
    const { cid } = useParams(); // current course id
    const [quizzes, setQuizzes] = useState<any[]>([]);

    useEffect(() => {
        if (!cid) return;
        // Filter quizzes by course id
        const filtered = quizzesData.filter(q => q._id === cid);
        setQuizzes(filtered);
    }, [cid]);

    if (!cid) {
        return <p>Loading course quizzes...</p>;
    }

    return (
        <div id="wd-quizzes">
            <h1>Quizzes</h1>
            <div>
                <div id="wd-module-buttons" className="me-5">
                    <br /><br /><br />
                </div>

                <ListGroup className="rounded-0 me-5" id="wd-modules">
                    {quizzes.map((m: any) => (
                        <ListGroupItem key={`${m._id}-${m.name}`} className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3" />
                                {m.name}
                            </div>

                            {m.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {m.lessons.map((lesson: { _id: string; name: string }) => (
                                        <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                            <BsGripVertical className="me-2 fs-3" />
                                            {lesson.name}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
}
