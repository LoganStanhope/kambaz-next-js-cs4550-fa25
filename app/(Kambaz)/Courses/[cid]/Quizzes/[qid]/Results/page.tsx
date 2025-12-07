'use client';
import React, {useEffect, useState} from "react";
import {Card, Alert} from "react-bootstrap";
import {useParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/(Kambaz)/store";
import {fetchQuiz, getStudentAttempt} from "../../../../../Courses/client";
import {FaCheck, FaTimes} from "react-icons/fa";

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

interface Attempt {
    attemptId: string;
    studentId: string;
    submittedAt: string;
    answers: Record<string, any>;
    score: number;
    totalPoints: number;
}

export default function QuizResults() {
    const {cid, qid} = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser);
    // @ts-expect-error complaining about id but object accessing is ok
    const studentId = currentUser?._id;

    useEffect(() => {
        if (!cid || !qid || !studentId) return;

        const loadData = async () => {
            try {
                const [quizData, attemptData] = await Promise.all([
                    fetchQuiz(cid, qid),
                    getStudentAttempt(cid as string, qid as string, studentId)
                ]);
                setQuiz(quizData);
                setAttempt(attemptData);
            } catch (error) {
                console.error("Failed to load quiz results:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [cid, qid, studentId]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    };

    const isAnswerCorrect = (question: Question): boolean => {
        if (!attempt) return false;
        const userAnswer = attempt.answers[question.questionId];
        
        if (question.type === 'TFQ') {
            return userAnswer !== null && userAnswer !== undefined && userAnswer === question.correctAnswer;
        } else if (question.type === 'MCQ') {
            if (userAnswer === null || userAnswer === undefined) return false;
            const correctChoice = question.choices?.find(c => c.isCorrect);
            return correctChoice !== undefined && 
                   (userAnswer === correctChoice._id || userAnswer === correctChoice.text);
        } else if (question.type === 'FIBQ') {
            if (!userAnswer || typeof question.correctAnswer !== 'string') return false;
            return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        }
        return false;
    };

    if (loading) {
        return <div className="p-4">Loading results...</div>;
    }

    if (!quiz || !attempt) {
        return (
            <div className="p-4">
                <Alert variant="warning">No quiz attempt found.</Alert>
            </div>
        );
    }

    const scorePercentage = attempt.totalPoints > 0 
        ? Math.round((attempt.score / attempt.totalPoints) * 100) 
        : 0;

    return (
        <div className="p-4">
            <h2>{quiz.name} - Results</h2>

            <div className="mb-4">
                <p className="mb-1"><strong>Submitted:</strong> {formatTime(attempt.submittedAt)}</p>
            </div>

            <Card className="mb-4">
                <Card.Header>
                    <h4>Final Score: {attempt.score} / {attempt.totalPoints} ({scorePercentage}%)</h4>
                </Card.Header>
            </Card>

            {quiz.questions.map((question: Question, index: number) => {
                const isCorrect = isAnswerCorrect(question);
                const userAnswer = attempt.answers[question.questionId];
                const questionScore = isCorrect ? question.points : 0;

                return (
                    <Card key={question.questionId} className={`mb-3 ${!isCorrect ? 'border-danger' : 'border-success'}`} style={{borderWidth: '2px'}}>
                        <Card.Header className={`d-flex justify-content-between align-items-center ${!isCorrect ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                            <div className="d-flex align-items-center gap-2">
                                {isCorrect ? (
                                    <FaCheck className="fs-4" />
                                ) : (
                                    <FaTimes className="fs-4" />
                                )}
                                <h6 className="mb-0" style={{fontWeight: 'bold'}}>Question {index + 1}</h6>
                            </div>
                            <span>{questionScore} / {question.points} pts</span>
                        </Card.Header>
                        <Card.Body>
                            {question.title && (
                                <div className="mb-2" style={{fontSize: '1.1rem', fontWeight: '600'}}>
                                    {question.title}
                                </div>
                            )}
                            {question.questionHtml && (
                                <div className="mb-3">
                                    <div dangerouslySetInnerHTML={{__html: question.questionHtml}} />
                                </div>
                            )}

                            <div className="mb-2">
                                <strong>Your Answer:</strong>{' '}
                                {question.type === 'TFQ' ? (userAnswer ? 'True' : 'False') :
                                 question.type === 'MCQ' ? (
                                     question.choices?.find(c => 
                                         c._id === userAnswer || c.text === userAnswer
                                     )?.text || userAnswer || 'No answer'
                                 ) : userAnswer || 'No answer'}
                            </div>

                            {!isCorrect && (
                                <div className="mb-2">
                                    <strong>Correct Answer:</strong>{' '}
                                    {question.type === 'TFQ' ? (question.correctAnswer ? 'True' : 'False') :
                                     question.type === 'MCQ' ? (
                                         question.choices?.find(c => c.isCorrect)?.text || question.correctAnswer
                                     ) : question.correctAnswer}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
}

