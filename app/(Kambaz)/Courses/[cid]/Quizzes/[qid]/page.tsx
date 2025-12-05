'use client';
import React, {useEffect, useState} from "react";
import {Button, Col, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row} from "react-bootstrap";
import {AiFillCalendar} from "react-icons/ai";
import InputGroupText from "react-bootstrap/InputGroupText";
import {useDispatch, useSelector} from "react-redux";
import {useRouter,useParams} from "next/navigation";
import {RootState} from "@/app/(Kambaz)/store";
import { fetchQuiz, saveQuiz } from "../../../../Courses/client";

export default function QuizDetails() {
    const { cid, qid } = useParams();
    const isNewQuiz = qid === "new";
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [quizState, setQuizState] = useState<any>(null);
    // @ts-expect-error because it complains about accessing role in this way
    const currentUserRole = useSelector((state: RootState) => state.accountReducer.currentUser?.role);
    const isFaculty = currentUserRole != 'STUDENT';
    const dispatch = useDispatch();

    useEffect(() => {
        if (!cid || !qid) return;

        if (qid === "new") {
            setQuiz({});
            setQuizState({
                name: '',
                points: 0,
                quizType: 'Graded Quiz',
                assignmentGroup: 'Quizzes',
                shuffleAnswers: 'Yes',
                timeLimit: 20,
                multipleAttempts: 'No',
                howManyAttempts: 1,
                showCorrectAnswers: 'No',
                accessCode: '',
                oneQuestionAtATime: 'Yes',
                webcamRequired: 'No',
                lockQuestionsAfterAnswering: 'No',
                due_date: '',
                available_date: '',
                until_date: '',
            });
        } else {
            fetchQuiz(cid, qid)
                .then(fetchedQuiz => {
                    setQuiz(fetchedQuiz);
                    setQuizState({
                        name: fetchedQuiz.name,
                        points: fetchedQuiz.points || 0,
                        quizType: fetchedQuiz.quizType || 'Graded Quiz',
                        assignmentGroup: fetchedQuiz.assignmentGroup || 'Quizzes',
                        shuffleAnswers: fetchedQuiz.shuffleAnswers || 'Yes',
                        timeLimit: fetchedQuiz.timeLimit || 20,
                        multipleAttempts: fetchedQuiz.multipleAttempts || 'No',
                        howManyAttempts: fetchedQuiz.howManyAttempts || 1,
                        showCorrectAnswers: fetchedQuiz.showCorrectAnswers || 'No',
                        accessCode: fetchedQuiz.accessCode || '',
                        oneQuestionAtATime: fetchedQuiz.oneQuestionAtATime || 'Yes',
                        webcamRequired: fetchedQuiz.webcamRequired || 'No',
                        lockQuestionsAfterAnswering: fetchedQuiz.lockQuestionsAfterAnswering || 'No',
                        due_date: fetchedQuiz.due_date || '',
                        available_date: fetchedQuiz.available_date || '',
                        until_date: fetchedQuiz.available_until || '',
                    });
                })
                .catch(err => console.error(err));
        }
    }, [cid, qid]);

    const initialBlankState = {
        name: '',
        points: 0,
        quizType: 'Graded Quiz',
        assignmentGroup: 'Quizzes',
        shuffleAnswers: 'Yes',
        timeLimit: 20,
        multipleAttempts: 'No',
        howManyAttempts: 1,
        showCorrectAnswers: 'No',
        accessCode: '',
        oneQuestionAtATime: 'Yes',
        webcamRequired: 'No',
        lockQuestionsAfterAnswering: 'No',
        due_date: '',
        available_date: '',
        until_date: '',
    };

    useEffect(() => {
        if (isNewQuiz) {
            setQuizState(initialBlankState);
        } else {
            fetchQuiz(cid, qid).then(fetchedQuiz => setQuizState(fetchedQuiz));
        }
    }, [cid, qid]);

    if (!quizState) {
        return <p>Loading quiz...</p>; // now safe
    }

    const handleSave = async () => {
        const updatedQuiz = {
            ...quizState,
            available_until: quizState.until_date
        };

        let saved;
        if (qid === "new") {
            saved = await saveQuiz(cid, undefined, updatedQuiz); // server interprets undefined qid as create
        } else {
            saved = await saveQuiz(cid, qid, updatedQuiz); // update existing
        }

        setQuiz(saved);
        router.back();
    };

    return (
        <div className="p-4">
            <h2>Quiz Details</h2>

            {isFaculty ? (
                <div className="d-flex flex-column gap-3">
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Quiz Name</FormLabel>
                        <Col sm={8}>
                            <FormControl
                                type="text"
                                value={quizState.name}
                                onChange={e => setQuizState({...quizState, name: e.target.value})}
                                placeholder="Quiz"
                            />
                        </Col>
                    </FormGroup>
                    {/* Editable form for faculty */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Quiz Type</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                defaultValue="Graded Quiz"
                                onChange={e => setQuizState({...quizState, quizType: e.target.value})}
                            >
                                <option>Graded Quiz</option>
                                <option>Practice Quiz</option>
                                <option>Graded Survey</option>
                                <option>Ungraded Survey</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Points</FormLabel>
                        <Col sm={8}>
                            <FormControl
                                type="number"
                                value={quizState.points}
                                onChange={e => setQuizState({...quizState, points: parseInt(e.target.value) || 0})}
                            />
                        </Col>
                    </FormGroup>

                    {/* Assignment Group */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Assignment Group</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.assignmentGroup}
                                onChange={e => setQuizState({...quizState, assignmentGroup: e.target.value})}
                            >
                                <option>Quizzes</option>
                                <option>Exams</option>
                                <option>Assignments</option>
                                <option>Project</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Shuffle Answers */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Shuffle Answers</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.shuffleAnswers}
                                onChange={e => setQuizState({...quizState, shuffleAnswers: e.target.value})}
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Time Limit */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Time Limit (Minutes)</FormLabel>
                        <Col sm={8}>
                            <FormControl
                                type="number"
                                value={quizState.timeLimit}
                                onChange={e => setQuizState({...quizState, timeLimit: parseInt(e.target.value) || 20})}
                            />
                        </Col>
                    </FormGroup>

                    {/* Multiple Attempts */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Multiple Attempts</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.multipleAttempts}
                                onChange={e => setQuizState({...quizState, multipleAttempts: e.target.value})}
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {quizState.multipleAttempts === 'Yes' && (
                        <FormGroup as={Row}>
                            <FormLabel column sm={4}>How Many Attempts</FormLabel>
                            <Col sm={8}>
                                <FormControl
                                    type="number"
                                    value={quizState.howManyAttempts}
                                    onChange={e => setQuizState({
                                        ...quizState,
                                        howManyAttempts: parseInt(e.target.value) || 1
                                    })}
                                />
                            </Col>
                        </FormGroup>
                    )}

                    {/* Show Correct Answers */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Show Correct Answers</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.showCorrectAnswers}
                                onChange={e => setQuizState({...quizState, showCorrectAnswers: e.target.value})}>

                                <option>No</option>
                                <option>Immediately</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Access Code */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Access Code</FormLabel>
                        <Col sm={8}>
                            <FormControl
                                type="text"
                                value={quizState.accessCode}
                                onChange={e => setQuizState({...quizState, accessCode: e.target.value})}
                                placeholder="Optional"
                            />
                        </Col>
                    </FormGroup>

                    {/* One Question at a Time */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>One Question at a Time</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.oneQuestionAtATime}
                                onChange={e => setQuizState({...quizState, oneQuestionAtATime: e.target.value})}
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Webcam Required */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Webcam Required</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.webcamRequired}
                                onChange={e => setQuizState({...quizState, webcamRequired: e.target.value})}
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Lock Questions After Answering */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Lock Questions After Answering</FormLabel>
                        <Col sm={8}>
                            <FormSelect
                                value={quizState.lockQuestionsAfterAnswering}
                                onChange={e => setQuizState({
                                    ...quizState,
                                    lockQuestionsAfterAnswering: e.target.value
                                })}
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </FormSelect>
                        </Col>
                    </FormGroup>

                    {/* Dates */}
                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Due Date</FormLabel>
                        <Col sm={8}>
                            <InputGroup>
                                <FormControl
                                    type="date"
                                    value={quizState.due_date}
                                    onChange={e => setQuizState({...quizState, due_date: e.target.value})}
                                />
                                <InputGroupText><AiFillCalendar/></InputGroupText>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Available Date</FormLabel>
                        <Col sm={8}>
                            <InputGroup>
                                <FormControl
                                    type="date"
                                    value={quizState.available_date}
                                    onChange={e => setQuizState({...quizState, available_date: e.target.value})}
                                />
                                <InputGroupText><AiFillCalendar/></InputGroupText>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <FormGroup as={Row}>
                        <FormLabel column sm={4}>Until Date</FormLabel>
                        <Col sm={8}>
                            <InputGroup>
                                <FormControl
                                    type="date"
                                    value={quizState.until_date}
                                    onChange={e => setQuizState({...quizState, until_date: e.target.value})}
                                />
                                <InputGroupText><AiFillCalendar/></InputGroupText>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <div className="mt-3">
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {/* Students: read-only */}
                    <p>Quiz Type: {quizState.quizType}</p>
                    <p>Points: {quizState.points}</p>
                    <p>Assignment Group: {quizState.assignmentGroup}</p>
                    <p>Time Limit: {quizState.timeLimit} minutes</p>
                    <p>Due Date: {quizState.due_date}</p>
                    <p>Available From: {quizState.available_date}</p>
                    <p>Until: {quizState.until_date}</p>
                    <Button variant="success">Start Quiz</Button>
                </div>
            )}
        </div>
    );
}
