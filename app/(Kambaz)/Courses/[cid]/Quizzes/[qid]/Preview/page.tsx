'use client';
import React, {useEffect, useState} from "react";
import {Button, Card, Form, Alert, ListGroup, ListGroupItem} from "react-bootstrap";
import {useParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/(Kambaz)/store";
import {fetchQuiz} from "../../../../../Courses/client";
import {FaPencilAlt} from "react-icons/fa";
import {FaExclamationCircle, FaQuestionCircle, FaArrowRight} from "react-icons/fa";

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
}

export default function QuizPreview() {
    const {cid, qid} = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startTime] = useState(new Date());
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    // @ts-expect-error because it complains about accessing role in this way
    const currentUserRole = useSelector((state: RootState) => state.accountReducer.currentUser?.role);
    const isFaculty = currentUserRole != 'STUDENT';

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
                // Initialize saved timestamp when quiz loads
                setLastSaved(new Date());
            })
            .catch(err => console.error("Failed to load quiz", err));
    }, [cid, qid]);

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({...prev, [questionId]: value}));
        // Update saved timestamp immediately when answer changes
        setLastSaved(new Date());
    };

    const calculateScore = (): {earnedScore: number; totalScore: number} => {
        if (!quiz) return {earnedScore: 0, totalScore: 0};
        let totalScore = 0;
        let earnedScore = 0;

        quiz.questions.forEach((question: Question) => {
            totalScore += question.points;
            const userAnswer = answers[question.questionId];

            if (question.type === 'TFQ') {
                // For True/False, correctAnswer is a boolean
                if (userAnswer !== null && userAnswer === question.correctAnswer) {
                    earnedScore += question.points;
                }
            } else if (question.type === 'MCQ') {
                // For MCQ, correctAnswer might be a choice ID or the choice itself
                if (userAnswer !== null) {
                    const correctChoice = question.choices.find(c => c.isCorrect);
                    if (correctChoice && (userAnswer === correctChoice._id || userAnswer === correctChoice.text)) {
                        earnedScore += question.points;
                    }
                }
            } else if (question.type === 'FIBQ') {
                // For Fill in the Blank, correctAnswer is a string (case-insensitive comparison)
                if (userAnswer && typeof question.correctAnswer === 'string') {
                    if (userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
                        earnedScore += question.points;
                    }
                }
            }
        });

        return {earnedScore, totalScore};
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const isAnswerCorrect = (question: Question): boolean => {
        const userAnswer = answers[question.questionId];
        
        if (question.type === 'TFQ') {
            return userAnswer !== null && userAnswer === question.correctAnswer;
        } else if (question.type === 'MCQ') {
            if (userAnswer === null) return false;
            const correctChoice = question.choices.find(c => c.isCorrect);
            return correctChoice !== undefined && 
                   (userAnswer === correctChoice._id || userAnswer === correctChoice.text);
        } else if (question.type === 'FIBQ') {
            if (!userAnswer || typeof question.correctAnswer !== 'string') return false;
            return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        }
        return false;
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

    if (!quiz) {
        return <div className="p-4">Loading quiz...</div>;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const {earnedScore, totalScore} = calculateScore();
    const scorePercentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;

    return (
        <div className="p-4" style={{backgroundColor: '#fff', minHeight: '100vh'}}>
            {/* Header - Title at top left */}
            <h2 className="mb-3">{quiz.name}</h2>

            {/* Preview Banner - Light red with exclamation */}
            <Alert 
                variant="danger" 
                className="mb-3"
                style={{
                    backgroundColor: '#f8d7da',
                    borderColor: '#f5c6cb',
                    color: '#721c24'
                }}
            >
                <FaExclamationCircle className="me-2" />
                This is a preview of the published version of the quiz.
            </Alert>

            {/* Started time */}
            <p className="mb-3"><strong>Started:</strong> {formatTime(startTime)}</p>

            {!isSubmitted ? (
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-md-3 mb-4">
                        {isFaculty && (
                            <Button
                                variant="outline-primary"
                                className="mb-4 w-100"
                                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}
                            >
                                <FaPencilAlt className="me-2" />
                                Keep Editing This Quiz
                            </Button>
                        )}

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
                        {/* Quiz Instructions heading - prominent with line underneath */}
                        <h3 className="mb-2" style={{fontSize: '1.5rem', fontWeight: '600'}}>Quiz Instructions</h3>
                        <hr className="mb-4" style={{borderTop: '1px solid #000', margin: '0'}} />

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
                                        <div className="mb-2" style={{fontSize: '1.1rem', fontWeight: '600'}}>
                                            {currentQuestion.title}
                                        </div>
                                    )}
                                    {currentQuestion.questionHtml && (
                                        <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6'}}>
                                            <div dangerouslySetInnerHTML={{__html: currentQuestion.questionHtml}} />
                                        </div>
                                    )}
                                    {!currentQuestion.title && !currentQuestion.questionHtml && (
                                        <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6', color: '#999'}}>
                                            No question content
                                        </div>
                                    )}

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
                                            {currentQuestion.choices.map((choice: Choice, index: number) => (
                                                <React.Fragment key={choice._id}>
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
                                                        className={index < currentQuestion.choices.length - 1 ? "mb-3" : ""}
                                                        style={{fontSize: '1rem'}}
                                                    />
                                                </React.Fragment>
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
                                        Next <FaArrowRight className="ms-1" />
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
                            >
                                Submit Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Quiz Results</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4">
                                <h5>Final Score: {earnedScore} / {totalScore} ({scorePercentage}%)</h5>
                            </div>

                            {quiz.questions.map((question: Question, index: number) => {
                                const isCorrect = isAnswerCorrect(question);
                                const userAnswer = answers[question.questionId];

                                return (
                                    <Card key={question.questionId} className={`mb-3 ${!isCorrect ? 'border-danger' : 'border-success'}`}>
                                        <Card.Header className={`d-flex justify-content-between align-items-center ${!isCorrect ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                            <h6 className="mb-0">Question {index + 1}</h6>
                                            <span>{isCorrect ? '✓ Correct' : '✗ Incorrect'} - {question.points} pts</span>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <div dangerouslySetInnerHTML={{__html: question.questionHtml || question.title}} />
                                            </div>

                                            {!isCorrect && (
                                                <>
                                                    <div className="mb-2">
                                                        <strong>Your Answer:</strong>{' '}
                                                        {question.type === 'TFQ' ? (userAnswer ? 'True' : 'False') :
                                                         question.type === 'MCQ' ? (
                                                             question.choices.find(c => 
                                                                 c._id === userAnswer || c.text === userAnswer
                                                             )?.text || userAnswer
                                                         ) : userAnswer}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>Correct Answer:</strong>{' '}
                                                        {question.type === 'TFQ' ? (question.correctAnswer ? 'True' : 'False') :
                                                         question.type === 'MCQ' ? (
                                                             question.choices.find(c => c.isCorrect)?.text || question.correctAnswer
                                                         ) : question.correctAnswer}
                                                    </div>
                                                </>
                                            )}

                                            {isCorrect && (
                                                <div className="text-success">
                                                    <strong>Correct!</strong> Your answer: {
                                                        question.type === 'TFQ' ? (userAnswer ? 'True' : 'False') :
                                                        question.type === 'MCQ' ? (
                                                            question.choices.find(c => 
                                                                c._id === userAnswer || c.text === userAnswer
                                                            )?.text || userAnswer
                                                        ) : userAnswer
                                                    }
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </Card.Body>
                    </Card>

                    {isFaculty && (
                        <div className="mb-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)}
                            >
                                <FaPencilAlt className="me-2" />
                                Keep Editing This Quiz
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

