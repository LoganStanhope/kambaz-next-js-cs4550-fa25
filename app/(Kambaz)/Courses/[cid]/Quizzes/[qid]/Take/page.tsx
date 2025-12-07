'use client';
import React, {useEffect, useState} from "react";
import {Button, Card, Form, Alert, ListGroup, ListGroupItem} from "react-bootstrap";
import {useParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/(Kambaz)/store";
import {fetchQuiz, submitQuizAttempt} from "../../../../../Courses/client";
import {FaQuestionCircle, FaArrowRight} from "react-icons/fa";

interface Choice {
    _id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    questionId: string;
    type: string; // MCQ, TFQ, FIBQ
    title: string;
    points: number;
    questionHtml: string;
    choices: Choice[];
    correctAnswer: any;
}

interface Quiz {
    _id: string;
    name: string;
    questions: Question[];
    points: number;
    num_questions: number;
    timeLimit?: number;
    available_date?: string;
    available_until?: string;
    due_date?: string;
    description?: string;
}

export default function TakeQuiz() {
    const {cid, qid} = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // in seconds
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser);
    // @ts-expect-error because it complains about accessing role in this way
    const studentId = currentUser?._id;

    useEffect(() => {
        if (!cid || !qid) return;
        fetchQuiz(cid, qid)
            .then((fetchedQuiz) => {
                setQuiz(fetchedQuiz);
                // Initialize answers object
                const initialAnswers: Record<string, any> = {};
                fetchedQuiz.questions?.forEach((q: Question) => {
                    if (q.type === 'TFQ') {
                        initialAnswers[q.questionId] = null;
                    } else if (q.type === 'MCQ') {
                        initialAnswers[q.questionId] = null;
                    } else if (q.type === 'FIBQ') {
                        initialAnswers[q.questionId] = '';
                    }
                });
                setAnswers(initialAnswers);
                // Initialize timer if timeLimit exists
                if (fetchedQuiz.timeLimit) {
                    setTimeRemaining(fetchedQuiz.timeLimit * 60); // Convert minutes to seconds
                }
            })
            .catch(err => console.error("Failed to load quiz", err));
    }, [cid, qid]);

    // Timer countdown
    useEffect(() => {
        if (!hasStarted || timeRemaining === null || isSubmitted || isSubmitting) return;
        
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, timeRemaining, isSubmitted, isSubmitting]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeRemaining === 0 && hasStarted && !isSubmitted && !isSubmitting && cid && qid && studentId && quiz) {
            const autoSubmit = async () => {
                setIsSubmitting(true);
                try {
                    await submitQuizAttempt(cid as string, qid as string, studentId, answers);
                    setIsSubmitted(true);
                    router.push(`/Courses/${cid}/Quizzes/${qid}/Results`);
                } catch (error) {
                    console.error("Failed to auto-submit quiz:", error);
                    alert("Time expired. Quiz submitted automatically.");
                    router.push(`/Courses/${cid}/Quizzes/${qid}/Results`);
                } finally {
                    setIsSubmitting(false);
                }
            };
            autoSubmit();
        }
    }, [timeRemaining, hasStarted, isSubmitted, isSubmitting, cid, qid, studentId, quiz, answers, router]);

    // Auto-save functionality
    useEffect(() => {
        if (!quiz || !hasStarted || isSubmitted) return;
        const saveInterval = setInterval(() => {
            setLastSaved(new Date());
        }, 30000); // Save every 30 seconds

        return () => clearInterval(saveInterval);
    }, [quiz, hasStarted, isSubmitted]);

    const handleStart = () => {
        setHasStarted(true);
        setStartTime(new Date());
        setLastSaved(new Date());
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({...prev, [questionId]: value}));
        setLastSaved(new Date());
    };

    const handleSubmit = async () => {
        if (!cid || !qid || !studentId || !quiz) return;
        
        setIsSubmitting(true);
        try {
            await submitQuizAttempt(cid as string, qid as string, studentId, answers);
            setIsSubmitted(true);
            // Redirect to results page
            router.push(`/Courses/${cid}/Quizzes/${qid}/Results`);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    };

    const formatTimeRemaining = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (!quiz) {
        return <div className="p-4">Loading quiz...</div>;
    }

    // Start screen - show before quiz begins
    if (!hasStarted) {
        return (
            <div className="p-4" style={{backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
                <h2 className="mb-4">{quiz.name}</h2>
                
                <Card className="mb-4" style={{border: '2px solid #000', boxShadow: 'none', backgroundColor: '#fff'}}>
                    <Card.Body style={{padding: '1.5rem'}}>
                        <div className="mb-3">
                            <strong>Quiz Type:</strong> Graded Quiz
                        </div>
                        <div className="mb-3">
                            <strong>Points:</strong> {quiz.points}
                        </div>
                        <div className="mb-3">
                            <strong>Questions:</strong> {quiz.num_questions || quiz.questions?.length || 0}
                        </div>
                        {quiz.timeLimit && (
                            <div className="mb-3">
                                <strong>Time Limit:</strong> {quiz.timeLimit} {quiz.timeLimit === 1 ? 'minute' : 'minutes'}
                            </div>
                        )}
                        {quiz.available_date && (
                            <div className="mb-3">
                                <strong>Available:</strong> {new Date(quiz.available_date).toLocaleString()}
                            </div>
                        )}
                        {quiz.due_date && (
                            <div className="mb-3">
                                <strong>Due:</strong> {new Date(quiz.due_date).toLocaleString()}
                            </div>
                        )}
                        {quiz.description && (
                            <div className="mb-3">
                                <strong>Description:</strong>
                                <div className="mt-2" dangerouslySetInnerHTML={{__html: quiz.description}} />
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleStart}
                    >
                        Start Quiz
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="p-4" style={{backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
            <h2 className="mb-3">{quiz.name}</h2>

            {/* Timer display */}
            {timeRemaining !== null && (
                <Alert 
                    variant={timeRemaining < 60 ? "danger" : timeRemaining < 300 ? "warning" : "info"}
                    className="mb-3"
                >
                    <strong>Time Remaining:</strong> {formatTimeRemaining(timeRemaining)}
                </Alert>
            )}

            {startTime && (
                <p className="mb-3"><strong>Started:</strong> {formatTime(startTime)}</p>
            )}

            <h3 className="mb-2" style={{fontSize: '1.5rem', fontWeight: '600'}}>Quiz Instructions</h3>
            <hr className="mb-4" style={{borderTop: '1px solid #000'}} />

            {!isSubmitted ? (
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-md-3 mb-4">
                        <Card>
                            <Card.Header>
                                <h6 className="mb-0">Questions</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <ListGroup variant="flush">
                                    {quiz.questions.map((q: Question, index: number) => (
                                        <ListGroupItem
                                            key={q.questionId}
                                            action
                                            active={index === currentQuestionIndex}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            style={{
                                                color: (answers[q.questionId] === null ||
                                                       answers[q.questionId] === '') ? '#dc3545' : 'inherit',
                                                cursor: 'pointer',
                                                backgroundColor: index === currentQuestionIndex ? '#e7f3ff' : 'transparent',
                                                borderLeft: index === currentQuestionIndex ? '4px solid #0d6efd' : 'none'
                                            }}
                                            className="d-flex align-items-center"
                                        >
                                            <FaQuestionCircle className="me-2" style={{color: '#dc3545'}} />
                                            Question {index + 1}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-md-9">
                        {currentQuestion && (
                            <Card className="mb-3" style={{border: '2px solid #000', boxShadow: 'none', backgroundColor: '#fff'}}>
                                <Card.Header
                                    className="d-flex justify-content-between align-items-center"
                                    style={{backgroundColor: '#e9ecef', borderBottom: '1px solid #000', padding: '1rem'}}
                                >
                                    <h5 className="mb-0" style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Question {currentQuestionIndex + 1}</h5>
                                    <span style={{fontSize: '0.9rem', fontWeight: '500'}}>{currentQuestion.points} pts</span>
                                </Card.Header>
                                <Card.Body style={{padding: '1.5rem'}}>
                                    {currentQuestion.title && (
                                        <h5 className="mb-3" style={{fontWeight: 'bold'}}>{currentQuestion.title}</h5>
                                    )}
                                    <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6'}}>
                                        <div dangerouslySetInnerHTML={{__html: currentQuestion.questionHtml || ''}} />
                                    </div>

                                    {currentQuestion.type === 'TFQ' && (
                                        <Form>
                                            <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                                            <Form.Check
                                                type="radio"
                                                label="True"
                                                name={`question-${currentQuestion.questionId}`}
                                                id={`${currentQuestion.questionId}-true`}
                                                checked={answers[currentQuestion.questionId] === true}
                                                onChange={() => handleAnswerChange(currentQuestion.questionId, true)}
                                                className="mb-3"
                                                style={{fontSize: '1rem'}}
                                            />
                                            <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                                            <Form.Check
                                                type="radio"
                                                label="False"
                                                name={`question-${currentQuestion.questionId}`}
                                                id={`${currentQuestion.questionId}-false`}
                                                checked={answers[currentQuestion.questionId] === false}
                                                onChange={() => handleAnswerChange(currentQuestion.questionId, false)}
                                                style={{fontSize: '1rem'}}
                                            />
                                        </Form>
                                    )}

                                    {currentQuestion.type === 'MCQ' && (
                                        <Form>
                                            {currentQuestion.choices.map((choice: Choice) => (
                                                <div key={choice._id}>
                                                    <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                                                    <Form.Check
                                                        type="radio"
                                                        label={choice.text}
                                                        name={`question-${currentQuestion.questionId}`}
                                                        id={`${currentQuestion.questionId}-${choice._id}`}
                                                        checked={answers[currentQuestion.questionId] === choice._id ||
                                                                answers[currentQuestion.questionId] === choice.text}
                                                        onChange={() => handleAnswerChange(
                                                            currentQuestion.questionId,
                                                            choice._id || choice.text
                                                        )}
                                                        className="mb-3"
                                                        style={{fontSize: '1rem'}}
                                                    />
                                                </div>
                                            ))}
                                        </Form>
                                    )}

                                    {currentQuestion.type === 'FIBQ' && (
                                        <Form>
                                            <Form.Control
                                                type="text"
                                                value={answers[currentQuestion.questionId] || ''}
                                                onChange={(e) => handleAnswerChange(currentQuestion.questionId, e.target.value)}
                                                placeholder="Enter your answer"
                                                style={{fontSize: '1rem'}}
                                            />
                                        </Form>
                                    )}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Navigation buttons below quiz box but above submit box */}
                        <div className="d-flex justify-content-between gap-2 mb-3">
                            <div>
                                {currentQuestionIndex > 0 && (
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setCurrentQuestionIndex(prev => prev - 1);
                                        }}
                                    >
                                        ◂ Previous
                                    </Button>
                                )}
                            </div>
                            <div>
                                {currentQuestionIndex < quiz.questions.length - 1 && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setCurrentQuestionIndex(prev => prev + 1);
                                        }}
                                    >
                                        Next <FaArrowRight className="ms-2" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Bottom Action Bar - White bar with save status and submit button */}
                        <div
                            className="d-flex justify-content-between align-items-center p-3"
                            style={{
                                backgroundColor: '#fff',
                                border: '1px solid #000',
                                borderRadius: '4px',
                                marginTop: '20px'
                            }}
                        >
                            <div>
                                {lastSaved && (
                                    <span className="text-muted">
                                        Quiz saved at {formatTime(lastSaved)}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="danger"
                                size="lg"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Alert variant="info">
                    Quiz submitted! Redirecting to results...
                </Alert>
            )}
        </div>
    );
}
