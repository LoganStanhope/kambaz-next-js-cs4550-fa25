"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    FormCheck,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    InputGroup,
    Row,
    Card,
    ListGroup,
    ListGroupItem,
    Alert,
    Modal,
    Form,
} from "react-bootstrap";
import { AiFillCalendar } from "react-icons/ai";
import InputGroupText from "react-bootstrap/InputGroupText";
import {
    FaQuestionCircle,
    FaArrowRight,
    FaCheck,
    FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import { RootState } from "@/app/(Kambaz)/store";
import {
    fetchQuiz,
    saveQuiz,
    canStudentTakeQuiz,
    getStudentAttempt,
    submitQuizAttempt,
    getStudentAttemptCount,
} from "../../../../Courses/client";
import { updateQuiz } from "../reducer";

export default function QuizDetails() {
    const { cid, qid } = useParams();
    const isNewQuiz = qid === "new";
    const router = useRouter();
    const pathname = usePathname();

    const [quiz, setQuiz] = useState<any>(null);
    const [quizState, setQuizState] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // @ts-expect-error because it complains about accessing role in this way
    const currentUserRole = useSelector(
        (state: RootState) => state.accountReducer.currentUser?.role
    );
    const isFaculty = currentUserRole !== "STUDENT";
    const currentUser = useSelector(
        (state: RootState) => state.accountReducer.currentUser
    ) as any;
    const dispatch = useDispatch();

    // student quiz-taking state
    const [canTake, setCanTake] = useState<any>(null);
    const [hasAttempt, setHasAttempt] = useState(false);
    const [attemptCount, setAttemptCount] = useState<number>(0);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
        null
    );
    const [hasStarted, setHasStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [accessCodeInput, setAccessCodeInput] = useState("");
    const [submissionResult, setSubmissionResult] = useState<any>(null);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // seconds

    // ---------- Load quiz ----------
    useEffect(() => {
        if (!cid || !qid) return;

        setIsLoading(true);
        setQuiz(null);
        setQuizState(null);
        setCanTake(null);
        setHasAttempt(false);
        setAttemptCount(0);
        setRemainingAttempts(null);
        setHasStarted(false);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setStartTime(null);
        setLastSaved(null);
        setIsSubmitting(false);
        setIsSubmitted(false);
        setSubmissionResult(null);
        setQuizQuestions([]);
        setTimeRemaining(null);

        if (isNewQuiz) {
            const initial = {
                name: "",
                description: "",
                points: 0,
                quizType: "Graded Quiz",
                assignmentGroup: "Quizzes",
                shuffleAnswers: "Yes",
                timeLimit: 20,
                multipleAttempts: "No",
                howManyAttempts: 1,
                showCorrectAnswers: "No",
                accessCode: "",
                oneQuestionAtATime: "Yes",
                webcamRequired: "No",
                lockQuestionsAfterAnswering: "No",
                due_date: "",
                available_date: "",
                until_date: "",
            };
            setQuiz({});
            setQuizState(initial);
            setIsLoading(false);
        } else {
            fetchQuiz(cid, qid)
                .then((fetchedQuiz) => {
                    setQuiz(fetchedQuiz);
                    setQuizState({
                        name: fetchedQuiz.name,
                        description: fetchedQuiz.description || "",
                        points: fetchedQuiz.points || 0,
                        quizType: fetchedQuiz.quizType || "Graded Quiz",
                        assignmentGroup: fetchedQuiz.assignmentGroup || "Quizzes",
                        shuffleAnswers: fetchedQuiz.shuffleAnswers || "Yes",
                        timeLimit:
                            typeof fetchedQuiz.timeLimit === "number"
                                ? fetchedQuiz.timeLimit
                                : 20,
                        multipleAttempts: fetchedQuiz.multipleAttempts || "No",
                        howManyAttempts: fetchedQuiz.howManyAttempts || 1,
                        showCorrectAnswers: fetchedQuiz.showCorrectAnswers || "No",
                        accessCode: fetchedQuiz.accessCode || "",
                        oneQuestionAtATime: fetchedQuiz.oneQuestionAtATime || "Yes",
                        webcamRequired: fetchedQuiz.webcamRequired || "No",
                        lockQuestionsAfterAnswering:
                            fetchedQuiz.lockQuestionsAfterAnswering || "No",
                        due_date: fetchedQuiz.due_date || "",
                        available_date: fetchedQuiz.available_date || "",
                        until_date: fetchedQuiz.available_until || "",
                    });

                    // student question init
                    if (!isFaculty && fetchedQuiz.questions) {
                        setQuizQuestions(fetchedQuiz.questions);
                        const initialAnswers: Record<string, any> = {};
                        fetchedQuiz.questions.forEach((q: any) => {
                            if (q.type === "TFQ" || q.type === "MCQ") {
                                initialAnswers[q.questionId] = null;
                            } else if (q.type === "FIBQ") {
                                initialAnswers[q.questionId] = "";
                            }
                        });
                        setAnswers(initialAnswers);
                        if (typeof fetchedQuiz.timeLimit === "number" && fetchedQuiz.timeLimit > 0) {
                            setTimeRemaining(fetchedQuiz.timeLimit * 60);
                        }
                    }

                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [cid, qid, isNewQuiz, isFaculty]);

    // ---------- Student: canTake / attempts ----------
    useEffect(() => {
        if (
            isFaculty ||
            isNewQuiz ||
            !cid ||
            !qid ||
            !currentUser?._id ||
            isLoading ||
            !quizState
        ) {
            return;
        }

        const checkQuizAccess = async () => {
            try {
                const canTakeResult = await canStudentTakeQuiz(
                    cid as string,
                    qid as string,
                    currentUser._id
                );
                setCanTake(canTakeResult);

                // Attempts left
                const left = (canTakeResult as any).attemptsLeft;
                if (left === null || left === undefined) {
                    setRemainingAttempts(null);
                } else {
                    const n = Number(left);
                    setRemainingAttempts(Number.isNaN(n) ? null : n);
                }

                try {
                    const countRes = await getStudentAttemptCount(
                        cid as string,
                        qid as string,
                        currentUser._id
                    );
                    const count =
                        typeof countRes === "object" && countRes !== null && "count" in countRes
                            ? (countRes as any).count
                            : typeof countRes === "number"
                                ? countRes
                                : 0;
                    setAttemptCount(count);
                } catch (error: any) {
                    console.error("Failed to get attempt count:", error);
                    setAttemptCount(0);
                }

                let attempt: any = null;
                try {
                    attempt = await getStudentAttempt(
                        cid as string,
                        qid as string,
                        currentUser._id
                    );
                    setHasAttempt(!!attempt);
                } catch (error: any) {
                    if (error?.response?.status !== 404) {
                        console.error("Failed to get student attempt:", error);
                    }
                    setHasAttempt(false);
                }

                // if no attempts left but we have an attempt, auto-show results
                if (
                    (left === 0 || canTakeResult.canTake === false) &&
                    attempt &&
                    !hasStarted &&
                    !isSubmitted
                ) {
                    setSubmissionResult(attempt);
                    setIsSubmitted(true);
                    setHasStarted(false);
                }
            } catch (error) {
                console.error("Failed to check quiz access:", error);
                setCanTake({
                    canTake: false,
                    reason: "Failed to check quiz availability",
                });
            }
        };

        checkQuizAccess();
    }, [
        isFaculty,
        isNewQuiz,
        cid,
        qid,
        currentUser,
        quizState?.multipleAttempts,
        quiz?.multipleAttempts,
        quizState?.howManyAttempts,
        quiz?.howManyAttempts,
        hasStarted,
        isSubmitted,
        isLoading,
        quizState,
    ]);

    // ---------- Timer ----------
    useEffect(() => {
        if (!hasStarted || timeRemaining === null || isSubmitted || isSubmitting) {
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, timeRemaining, isSubmitted, isSubmitting]);

    // auto-submit when time hits 0
    useEffect(() => {
        if (
            timeRemaining === 0 &&
            hasStarted &&
            !isSubmitted &&
            !isSubmitting &&
            cid &&
            qid &&
            currentUser?._id
        ) {
            const autoSubmit = async () => {
                setIsSubmitting(true);
                try {
                    await submitQuizAttempt(
                        cid as string,
                        qid as string,
                        currentUser._id,
                        answers
                    );
                    const attempt = await getStudentAttempt(
                        cid as string,
                        qid as string,
                        currentUser._id
                    );
                    setSubmissionResult(attempt);
                    setIsSubmitted(true);
                } catch (error) {
                    console.error("Failed to auto-submit quiz:", error);
                    alert("Time expired. Quiz submitted automatically.");
                } finally {
                    setIsSubmitting(false);
                }
            };
            autoSubmit();
        }
    }, [
        timeRemaining,
        hasStarted,
        isSubmitted,
        isSubmitting,
        cid,
        qid,
        currentUser,
        answers,
    ]);

    // ---------- helpers ----------
    const handleSave = async () => {
        const updatedQuiz = {
            ...quizState,
            available_until: quizState.until_date,
        };
        console.log("Saving Quiz Payload:", updatedQuiz);

        let saved;
        if (isNewQuiz) {
            saved = await saveQuiz(cid, undefined, updatedQuiz);
        } else {
            saved = await saveQuiz(cid, qid, updatedQuiz);
        }

        setQuiz(saved);
        dispatch(updateQuiz(saved));
        router.push(`/Courses/${cid}/Quizzes/${saved._id || qid}`);
    };

    const handleSaveAndPublish = async () => {
        const updatedQuiz = {
            ...quizState,
            available_until: quizState.until_date,
            published: true,
        };

        let saved;
        if (isNewQuiz) {
            saved = await saveQuiz(cid, undefined, updatedQuiz);
        } else {
            saved = await saveQuiz(cid, qid, updatedQuiz);
        }

        setQuiz(saved);
        dispatch(updateQuiz(saved));
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const handleCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    const handleStart = async () => {
        if (quizState?.accessCode && quizState.accessCode.trim() !== "") {
            if (!accessCodeInput || accessCodeInput.trim() !== quizState.accessCode.trim()) {
                alert("Incorrect access code.");
                return;
            }
        }

        if (canTake && !canTake.canTake) {
            alert(canTake.reason || "You cannot take this quiz at this time.");
            return;
        }
        if (remainingAttempts !== null && remainingAttempts <= 0) {
            alert("You have reached the maximum number of attempts for this quiz.");
            return;
        }

        if (!isFaculty && currentUser?._id && cid && qid) {
            try {
                const currentCountResult = await getStudentAttemptCount(
                    cid as string,
                    qid as string,
                    currentUser._id
                );
                const currentCount =
                    typeof currentCountResult === "object" &&
                    currentCountResult !== null &&
                    "count" in currentCountResult
                        ? (currentCountResult as any).count
                        : typeof currentCountResult === "number"
                            ? currentCountResult
                            : 0;
                setAttemptCount(currentCount);

                const multipleAttempts =
                    quizState?.multipleAttempts || quiz?.multipleAttempts;
                const howManyAttemptsRaw =
                    quizState?.howManyAttempts || quiz?.howManyAttempts;
                const howManyAttempts = howManyAttemptsRaw
                    ? Number(howManyAttemptsRaw)
                    : null;
                const validAttemptCount =
                    typeof currentCount === "number" && !isNaN(currentCount)
                        ? currentCount
                        : 0;

                let newRemaining: number | null;
                if (multipleAttempts === "No" || multipleAttempts === false) {
                    newRemaining = validAttemptCount > 0 ? 0 : 1;
                } else if (multipleAttempts === "Yes" || multipleAttempts === true) {
                    if (howManyAttempts && !isNaN(howManyAttempts) && howManyAttempts > 0) {
                        const calculated = howManyAttempts - validAttemptCount;
                        newRemaining = isNaN(calculated)
                            ? null
                            : Math.max(0, calculated);
                    } else {
                        newRemaining = null;
                    }
                } else {
                    newRemaining = validAttemptCount > 0 ? 0 : 1;
                }

                if (newRemaining !== null && newRemaining <= 0) {
                    alert("You have reached the maximum number of attempts for this quiz.");
                    return;
                }

                if (typeof window !== "undefined") {
                    window.dispatchEvent(
                        new CustomEvent("quizAttemptStarted", {
                            detail: { quizId: qid, courseId: cid },
                        })
                    );
                }
            } catch (error) {
                console.error("Failed to refresh attempt count before starting:", error);
                if (remainingAttempts !== null && remainingAttempts > 0) {
                    setRemainingAttempts(remainingAttempts - 1);
                    setAttemptCount((prev) => prev + 1);

                    if (typeof window !== "undefined") {
                        window.dispatchEvent(
                            new CustomEvent("quizAttemptStarted", {
                                detail: { quizId: qid, courseId: cid },
                            })
                        );
                    }
                }
            }
        }

        setHasStarted(true);
        setStartTime(new Date());
        setLastSaved(new Date());
    };

    const handleViewLastAttempt = async () => {
        if (!cid || !qid || !currentUser?._id) return;
        try {
            const attempt = await getStudentAttempt(
                cid as string,
                qid as string,
                currentUser._id
            );
            if (attempt) {
                setSubmissionResult(attempt);
                setIsSubmitted(true);
                setHasStarted(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error) {
            console.error("Failed to load last attempt:", error);
            alert("Failed to load your last attempt. Please try again.");
        }
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        setLastSaved(new Date());
    };

    const handleSubmit = async () => {
        if (!cid || !qid || !currentUser?._id) {
            alert("Missing required information. Please refresh and try again.");
            return;
        }
        if (!answers || Object.keys(answers).length === 0) {
            alert("Please answer at least one question before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Submit the attempt
            const submitResult = await submitQuizAttempt(
                cid as string,
                qid as string,
                currentUser._id,
                answers
            );

            // 2. Try to fetch the stored attempt from backend
            let attempt: any = null;
            try {
                attempt = await getStudentAttempt(
                    cid as string,
                    qid as string,
                    currentUser._id
                );
            } catch (error: any) {
                // If backend says "No attempt found" (404), don't treat that as fatal.
                // Fall back to whatever submitQuizAttempt returned (if it includes the attempt).
                if (error?.response?.status === 404) {
                    attempt = submitResult;
                } else {
                    // real error, rethrow so outer catch handles it
                    throw error;
                }
            }

            if (!attempt) {
                // No attempt object from either route; treat as success but without detailed breakdown
                setIsSubmitted(true);
                setSubmissionResult(null);
            } else {
                setSubmissionResult(attempt);
                setIsSubmitted(true);
            }

            // 3. Refresh attempt count, canTake, remainingAttempts as before
            try {
                const newCountResult = await getStudentAttemptCount(
                    cid as string,
                    qid as string,
                    currentUser._id
                );
                const newCount =
                    typeof newCountResult === "object" &&
                    newCountResult !== null &&
                    "count" in newCountResult
                        ? (newCountResult as any).count
                        : typeof newCountResult === "number"
                            ? newCountResult
                            : 0;
                setAttemptCount(newCount);

                const canTakeResult = await canStudentTakeQuiz(
                    cid as string,
                    qid as string,
                    currentUser._id
                );
                setCanTake(canTakeResult);

                const left = (canTakeResult as any).attemptsLeft;
                if (left === null || left === undefined) {
                    setRemainingAttempts(null);
                } else {
                    const n = Number(left);
                    setRemainingAttempts(Number.isNaN(n) ? null : n);
                }

                if (typeof window !== "undefined") {
                    window.dispatchEvent(
                        new CustomEvent("quizAttemptStarted", {
                            detail: { quizId: qid, courseId: cid },
                        })
                    );
                }
            } catch (error) {
                console.error("Failed to refresh attempt count:", error);
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            console.error("Failed to submit quiz:", error);
            const msg =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Unknown error occurred";
            alert(`Failed to submit quiz: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTimeRemaining = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("en-US", options);
    };

    const isAnswerCorrect = (question: any): boolean => {
        if (!submissionResult) return false;
        const userAnswer = submissionResult.answers[question.questionId];

        if (question.type === "TFQ") {
            if (userAnswer === null || userAnswer === undefined) return false;
            const userBool =
                userAnswer === true ||
                userAnswer === "true" ||
                String(userAnswer).toLowerCase() === "true";
            const correctBool =
                question.correctAnswer === true ||
                question.correctAnswer === "true" ||
                String(question.correctAnswer).toLowerCase() === "true";
            return userBool === correctBool;
        } else if (question.type === "MCQ") {
            if (userAnswer === null || userAnswer === undefined) return false;
            const correctChoice = question.choices?.find((c: any) => c.isCorrect);
            if (!correctChoice) return false;
            const userAnswerStr = String(userAnswer).trim();
            const correctIdStr = String(correctChoice._id || "").trim();
            const correctTextStr = String(correctChoice.text || "").trim();
            return (
                userAnswerStr === correctIdStr ||
                userAnswerStr === correctTextStr ||
                userAnswer === correctChoice._id ||
                userAnswer === correctChoice.text
            );
        } else if (question.type === "FIBQ") {
            if (!userAnswer || typeof question.correctAnswer !== "string") return false;
            return (
                String(userAnswer).trim().toLowerCase() ===
                String(question.correctAnswer).trim().toLowerCase()
            );
        }
        return false;
    };

    const getQuestionScore = (question: any): number =>
        submissionResult ? (isAnswerCorrect(question) ? question.points : 0) : 0;

    // ---------- rendering ----------
    if (isLoading || !quizState) {
        return (
            <div className="p-4">
                <p>Loading quiz...</p>
            </div>
        );
    }

    // Block students from unpublished quiz
    if (!isFaculty && quiz && quiz.published === false) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "400px" }}
            >
                <div className="text-center">
                    <h3>Quiz Not Available</h3>
                    <p className="mt-3">
                        This quiz is not published and is not available for students.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
                    >
                        Back to Quizzes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Quiz Tabs */}
            <div
                className="d-flex align-items-center border-bottom mb-3"
                style={{ gap: "20px" }}
            >
                <button
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                    className={`btn btn-link p-0 ${
                        !pathname.includes("Questions")
                            ? "text-danger active-tab"
                            : "text-secondary"
                    }`}
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        textDecoration: "none",
                        borderRadius: 0,
                    }}
                >
                    Details
                </button>

                <button
                    onClick={() =>
                        router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)
                    }
                    className={`btn btn-link p-0 ${
                        pathname.includes("Questions")
                            ? "text-danger active-tab"
                            : "text-secondary"
                    }`}
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        textDecoration: "none",
                        borderRadius: 0,
                    }}
                >
                    Questions
                </button>
            </div>

            <h2>Quiz Details</h2>

            {isFaculty ? (
                // ================== YOUR STYLIZED EDITOR ==================
                <div
                    id="wd-quiz-editor"
                    className="d-flex flex-column justify-content-end"
                >
                    <div>
                        <FormGroup as={Row} className="mb-1" controlId="email1">
                            <Col sm={20}>
                                <FormControl
                                    type="text"
                                    value={quizState.name}
                                    onChange={(e) =>
                                        setQuizState({ ...quizState, name: e.target.value })
                                    }
                                    placeholder="Quiz Name"
                                />
                            </Col>
                        </FormGroup>
                        <br />
                        <div className="quiz-text border rounded p-3">
                            <FormLabel className="mb-1">
                                Quiz Instructions (HTML allowed)
                            </FormLabel>
                            {/* Editable textarea */}
                            <FormControl
                                as="textarea"
                                rows={5}
                                value={quizState.description || ""}
                                onChange={(e) =>
                                    setQuizState({ ...quizState, description: e.target.value })
                                }
                                placeholder="Enter quiz instructions. You can use basic HTML tags (e.g., <b>, <i>, <ul>)." // text only – browser renders '&lt;&gt;'
                            />
                            {/* Live Preview */}
                            <div className="mt-3 p-2 border rounded bg-light">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            quizState.description ||
                                            "<p><em>No instructions yet</em></p>",
                                    }}
                                />
                            </div>
                        </div>
                        <br />
                    </div>

                    <div>
                        {/* Editable form for faculty */}
                        <FormGroup as={Row} className="mb-2">
                            <FormLabel column sm={2} className="text-end">
                                Quiz Type
                            </FormLabel>
                            <Col sm={3}>
                                <FormSelect
                                    defaultValue="Graded Quiz"
                                    onChange={(e) =>
                                        setQuizState({ ...quizState, quizType: e.target.value })
                                    }
                                >
                                    <option>Graded Quiz</option>
                                    <option>Practice Quiz</option>
                                    <option>Graded Survey</option>
                                    <option>Ungraded Survey</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>
                    </div>

                    <div>
                        <FormGroup as={Row} className="mb-2">
                            <FormLabel column sm={2} className="text-end">
                                Points
                            </FormLabel>
                            <Col sm={3}>
                                <FormControl
                                    type="number"
                                    value={quizState.points}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            points: parseInt(e.target.value) || 0,
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>
                    </div>

                    <div>
                        {/* Assignment Group */}
                        <FormGroup as={Row} className="mb-3">
                            <FormLabel column sm={2} className="text-end">
                                Assignment Group
                            </FormLabel>
                            <Col sm={3}>
                                <FormSelect
                                    value={quizState.assignmentGroup}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            assignmentGroup: e.target.value,
                                        })
                                    }
                                >
                                    <option>Quizzes</option>
                                    <option>Exams</option>
                                    <option>Assignments</option>
                                    <option>Project</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>
                    </div>

                    <div>
                        <Row className="mt-3 mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <strong>Options</strong>
                            </Col>
                        </Row>

                        {/* Shuffle Answers */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <FormCheck
                                    type="checkbox"
                                    id="shuffleAnswers"
                                    label="Shuffle Answers"
                                    checked={quizState.shuffleAnswers === "Yes"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            shuffleAnswers: e.target.checked ? "Yes" : "No",
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>

                        {/* Time Limit */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <div className="d-flex align-items-center gap-2">
                                    <FormCheck
                                        type="checkbox"
                                        id="timeLimit"
                                        label="Time Limit"
                                        checked={!!quizState.timeLimit}
                                        onChange={(e) =>
                                            setQuizState({
                                                ...quizState,
                                                timeLimit: e.target.checked
                                                    ? quizState.timeLimit || 20
                                                    : 0,
                                            })
                                        }
                                    />
                                    {quizState.timeLimit > 0 && (
                                        <>
                                            <FormControl
                                                style={{ maxWidth: 80 }}
                                                type="number"
                                                value={quizState.timeLimit}
                                                onChange={(e) =>
                                                    setQuizState({
                                                        ...quizState,
                                                        timeLimit: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                            />
                                            <span>Minutes</span>
                                        </>
                                    )}
                                </div>
                            </Col>
                        </FormGroup>

                        {/* Multiple Attempts */}
                        <FormGroup as={Row} className="mb-3">
                            <Col
                                sm={{ span: 3, offset: 2 }}
                                className="quiz-text border rounded p-3"
                            >
                                <FormCheck
                                    type="checkbox"
                                    id="multipleAttempts"
                                    label="Allow Multiple Attempts"
                                    checked={quizState.multipleAttempts === "Yes"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            multipleAttempts: e.target.checked ? "Yes" : "No",
                                        })
                                    }
                                />
                                {quizState.multipleAttempts === "Yes" && (
                                    <div className="mt-3 ms-4 d-flex align-items-center gap-2">
                                        <span>Attempts:</span>
                                        <FormControl
                                            type="number"
                                            style={{ maxWidth: 90 }}
                                            value={quizState.howManyAttempts}
                                            onChange={(e) =>
                                                setQuizState({
                                                    ...quizState,
                                                    howManyAttempts:
                                                        parseInt(e.target.value) || 1,
                                                })
                                            }
                                        />
                                    </div>
                                )}
                            </Col>
                        </FormGroup>
                    </div>

                    <div>
                        {/* RESTRICTIONS HEADER */}
                        <Row className="mt-4 mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <strong>Restrictions</strong>
                            </Col>
                        </Row>

                        {/* Show Correct Answers Immediately */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <FormCheck
                                    type="checkbox"
                                    id="showCorrectImmediately"
                                    label="Show Correct Answers Immediately"
                                    checked={quizState.showCorrectAnswers === "Immediately"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            showCorrectAnswers: e.target.checked
                                                ? "Immediately"
                                                : "No",
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>

                        {/* One Question at a Time */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <FormCheck
                                    type="checkbox"
                                    id="oneQuestionAtATime"
                                    label="One Question at a Time"
                                    checked={quizState.oneQuestionAtATime === "Yes"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            oneQuestionAtATime: e.target.checked ? "Yes" : "No",
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>

                        {/* Webcam Required */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <FormCheck
                                    type="checkbox"
                                    id="webcamRequired"
                                    label="Webcam Required"
                                    checked={quizState.webcamRequired === "Yes"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            webcamRequired: e.target.checked ? "Yes" : "No",
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>

                        {/* Lock Questions After Answering */}
                        <FormGroup as={Row} className="mb-2">
                            <Col sm={{ span: 9, offset: 2 }}>
                                <FormCheck
                                    type="checkbox"
                                    id="lockQuestionsAfterAnswering"
                                    label="Lock Questions After Answering"
                                    checked={quizState.lockQuestionsAfterAnswering === "Yes"}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            lockQuestionsAfterAnswering: e.target.checked
                                                ? "Yes"
                                                : "No",
                                        })
                                    }
                                />
                            </Col>
                        </FormGroup>

                        {/* Access Code */}
                        <FormGroup as={Row} className="mb-3">
                            <Col
                                sm={{ span: 9, offset: 2 }}
                                className="quiz-text border rounded p-3"
                            >
                                <FormLabel className="fw-bold">Access Code</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter access code"
                                    value={quizState.accessCode}
                                    onChange={(e) =>
                                        setQuizState({
                                            ...quizState,
                                            accessCode: e.target.value,
                                        })
                                    }
                                    style={{ maxWidth: 240 }}
                                />
                                <small className="text-muted ms-1">
                                    {" "}
                                    Leave blank for no access code.{" "}
                                </small>
                            </Col>
                        </FormGroup>
                    </div>

                    <div>
                        {/* Dates */}
                        <FormGroup as={Row} className="mb-3">
                            <FormLabel column sm={2} className="text-end">
                                Assign
                            </FormLabel>
                            <Col className="quiz-text border rounded p-3" sm={10}>
                                <b>Due</b>
                                <br />
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="date"
                                        size="lg"
                                        value={quizState.due_date}
                                        onChange={(e) =>
                                            setQuizState({
                                                ...quizState,
                                                due_date: e.target.value,
                                            })
                                        }
                                        id="wd-search"
                                    />
                                    <InputGroupText>
                                        <AiFillCalendar />
                                    </InputGroupText>
                                </InputGroup>

                                <div className="d-flex flex-row gap-3">
                                    <div className="d-flex flex-column mb">
                                        <b>Available Date</b>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="date"
                                                size="lg"
                                                value={quizState.available_date}
                                                onChange={(e) =>
                                                    setQuizState({
                                                        ...quizState,
                                                        available_date: e.target.value,
                                                    })
                                                }
                                                id="wd-search"
                                            />
                                            <InputGroupText>
                                                <AiFillCalendar />
                                            </InputGroupText>
                                        </InputGroup>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <b>Until Date</b>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                value={quizState.until_date}
                                                onChange={(e) =>
                                                    setQuizState({
                                                        ...quizState,
                                                        until_date: e.target.value,
                                                    })
                                                }
                                                type="date"
                                                size="lg"
                                                placeholder=""
                                                id="wd-search"
                                            />
                                            <InputGroupText>
                                                <AiFillCalendar />
                                            </InputGroupText>
                                        </InputGroup>
                                    </div>
                                </div>
                            </Col>
                        </FormGroup>
                        <br />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" size="lg" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="outline-danger" size="lg" onClick={handleSave}>
                            Save
                        </Button>
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={handleSaveAndPublish}
                        >
                            Save &amp; Publish
                        </Button>
                    </div>
                </div>
            ) : (
                // ================== STUDENT VIEW WITH QUIZ-TAKING ==================
                <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
                    <h2 className="mb-3">{quizState.name || quiz?.name || "Quiz"}</h2>

                    {isSubmitted && submissionResult ? (
                        <>
                            <Card className="mb-4">
                                <Card.Header className="bg-secondary text-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4 className="mb-0">
                                                Final Score: {submissionResult.score} /{" "}
                                                {submissionResult.totalPoints} (
                                                {Math.round(
                                                    (submissionResult.score /
                                                        submissionResult.totalPoints) *
                                                    100
                                                )}
                                                %)
                                            </h4>
                                            {submissionResult.submittedAt && (
                                                <p
                                                    className="mb-0 mt-2"
                                                    style={{ fontSize: "0.9rem", opacity: 0.9 }}
                                                >
                                                    Submitted:{" "}
                                                    {formatTime(
                                                        new Date(submissionResult.submittedAt)
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        {(remainingAttempts === null || remainingAttempts > 0) && (
                                            <Button
                                                variant="danger"
                                                size="lg"
                                                onClick={() => {
                                                    setHasStarted(false);
                                                    setIsSubmitted(false);
                                                    setSubmissionResult(null);
                                                    setCurrentQuestionIndex(0);
                                                    const initialAnswers: Record<string, any> = {};
                                                    quizQuestions.forEach((q: any) => {
                                                        if (q.type === "TFQ" || q.type === "MCQ") {
                                                            initialAnswers[q.questionId] = null;
                                                        } else if (q.type === "FIBQ") {
                                                            initialAnswers[q.questionId] = "";
                                                        }
                                                    });
                                                    setAnswers(initialAnswers);
                                                    if (quizState.timeLimit) {
                                                        setTimeRemaining(quizState.timeLimit * 60);
                                                    }
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }}
                                            >
                                                Retake Quiz
                                            </Button>
                                        )}
                                    </div>
                                </Card.Header>
                            </Card>

                            {quizQuestions.map((question: any, index: number) => {
                                const correct = isAnswerCorrect(question);
                                const userAnswer =
                                    submissionResult.answers[question.questionId];
                                const questionScore = getQuestionScore(question);

                                return (
                                    <Card
                                        key={question.questionId}
                                        className="mb-3"
                                        style={{
                                            border: "2px solid #000",
                                            boxShadow: "none",
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <Card.Header
                                            className="d-flex justify-content-between align-items-center"
                                            style={{
                                                backgroundColor: "#e9ecef",
                                                borderBottom: "1px solid #000",
                                                padding: "1rem",
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                {correct ? (
                                                    <FaCheck
                                                        className="fs-5"
                                                        style={{ color: "#28a745" }}
                                                    />
                                                ) : (
                                                    <FaTimes
                                                        className="fs-5"
                                                        style={{ color: "#dc3545" }}
                                                    />
                                                )}
                                                <h5
                                                    className="mb-0"
                                                    style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                                                >
                                                    Question {index + 1}
                                                </h5>
                                            </div>
                                            <span
                                                style={{ fontSize: "0.9rem", fontWeight: "500" }}
                                            >
                        {questionScore} / {question.points} pts
                      </span>
                                        </Card.Header>
                                        <Card.Body style={{ padding: "1.5rem" }}>
                                            {question.title && (
                                                <h5 className="mb-3" style={{ fontWeight: "bold" }}>
                                                    {question.title}
                                                </h5>
                                            )}
                                            <div
                                                className="mb-4"
                                                style={{ fontSize: "1rem", lineHeight: "1.6" }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: question.questionHtml || "",
                                                    }}
                                                />
                                            </div>

                                            {question.type === "TFQ" && (
                                                <div>
                                                    <p className="mb-3">
                                                        <strong>Your Answer:</strong>{" "}
                                                        {userAnswer === true
                                                            ? "True"
                                                            : userAnswer === false
                                                                ? "False"
                                                                : "Not answered"}
                                                    </p>
                                                    <div className="mb-2">
                                                        <hr style={{ margin: "0.5rem 0" }} />
                                                        {["True", "False"].map((option) => {
                                                            const userBool =
                                                                userAnswer === true ||
                                                                userAnswer === "true" ||
                                                                String(userAnswer).toLowerCase() === "true";
                                                            const correctBool =
                                                                question.correctAnswer === true ||
                                                                question.correctAnswer === "true" ||
                                                                String(
                                                                    question.correctAnswer
                                                                ).toLowerCase() === "true";

                                                            const isUserAnswer =
                                                                (userBool && option === "True") ||
                                                                (!userBool && option === "False");
                                                            const isCorrectAnswer =
                                                                (correctBool && option === "True") ||
                                                                (!correctBool && option === "False");
                                                            const isWrongAnswer =
                                                                isUserAnswer && !isCorrectAnswer;

                                                            return (
                                                                <div
                                                                    key={option}
                                                                    style={{
                                                                        padding: "0.75rem",
                                                                        marginBottom: "0.5rem",
                                                                        backgroundColor: isCorrectAnswer
                                                                            ? "#d4edda"
                                                                            : isWrongAnswer
                                                                                ? "#f8d7da"
                                                                                : "transparent",
                                                                        border: "1px solid",
                                                                        borderColor: isCorrectAnswer
                                                                            ? "#28a745"
                                                                            : isWrongAnswer
                                                                                ? "#dc3545"
                                                                                : "#dee2e6",
                                                                        borderRadius: "4px",
                                                                    }}
                                                                >
                                                                    {option}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {question.type === "MCQ" && (
                                                <div>
                                                    <p className="mb-3">
                                                        <strong>Your Answer:</strong>{" "}
                                                        {question.choices?.find(
                                                                (c: any) =>
                                                                    c._id === userAnswer ||
                                                                    c.text === userAnswer
                                                            )?.text ||
                                                            userAnswer ||
                                                            "Not answered"}
                                                    </p>
                                                    <div className="mb-2">
                                                        {question.choices?.map(
                                                            (choice: any, choiceIndex: number) => {
                                                                const isUserAnswer =
                                                                    userAnswer === choice._id ||
                                                                    userAnswer === choice.text;
                                                                const isCorrectAnswer = choice.isCorrect;
                                                                const isWrongAnswer =
                                                                    isUserAnswer && !isCorrectAnswer;

                                                                return (
                                                                    <div key={choice._id || choiceIndex}>
                                                                        <hr style={{ margin: "0.5rem 0" }} />
                                                                        <div
                                                                            style={{
                                                                                padding: "0.75rem",
                                                                                marginBottom: "0.5rem",
                                                                                backgroundColor: isCorrectAnswer
                                                                                    ? "#d4edda"
                                                                                    : isWrongAnswer
                                                                                        ? "#f8d7da"
                                                                                        : "transparent",
                                                                                border: "1px solid",
                                                                                borderColor: isCorrectAnswer
                                                                                    ? "#28a745"
                                                                                    : isWrongAnswer
                                                                                        ? "#dc3545"
                                                                                        : "#dee2e6",
                                                                                borderRadius: "4px",
                                                                            }}
                                                                        >
                                                                            {choice.text}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {question.type === "FIBQ" && (
                                                <div>
                                                    <p className="mb-2">
                                                        <strong>Your Answer:</strong>{" "}
                                                        {userAnswer || "Not answered"}
                                                    </p>
                                                    {!correct && (
                                                        <p className="mb-2">
                                                            <strong>Correct Answer:</strong>{" "}
                                                            {question.correctAnswer}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </>
                    ) : !hasStarted ? (
                        // start screen
                        <>
                            <div className="row">
                                <div className="col-md-9">
                                    <Card
                                        className="mb-4"
                                        style={{
                                            border: "2px solid #000",
                                            boxShadow: "none",
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <Card.Body style={{ padding: "1.5rem" }}>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        quizState.description ||
                                                        "<p><em>No instructions yet</em></p>",
                                                }}
                                            />
                                        </Card.Body>
                                    </Card>

                                    {quizState.accessCode && quizState.accessCode.trim() !== "" && (
                                        <div className="mb-3">
                                            <FormLabel>Access Code</FormLabel>
                                            <FormControl
                                                type="text"
                                                value={accessCodeInput}
                                                onChange={(e) => setAccessCodeInput(e.target.value)}
                                                placeholder="Enter access code to begin"
                                                style={{ maxWidth: 260 }}
                                            />
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-end mb-3">
                                        {canTake ? (
                                            canTake.canTake ? (
                                                <Button
                                                    variant="danger"
                                                    size="lg"
                                                    onClick={handleStart}
                                                >
                                                    Start
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" disabled size="lg">
                                                    {canTake.reason || "Cannot take quiz"}
                                                </Button>
                                            )
                                        ) : (
                                            <Button
                                                variant="danger"
                                                size="lg"
                                                onClick={handleStart}
                                            >
                                                Start
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    {quizQuestions.length > 0 && (
                                        <Card>
                                            <Card.Header>
                                                <h6 className="mb-0">Questions</h6>
                                            </Card.Header>
                                            <Card.Body className="p-0">
                                                <ListGroup variant="flush">
                                                    {quizQuestions.map((q: any, index: number) => (
                                                        <ListGroupItem
                                                            key={q.questionId}
                                                            style={{ cursor: "default" }}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <FaQuestionCircle
                                                                className="me-2"
                                                                style={{ color: "#dc3545" }}
                                                            />
                                                            Question {index + 1}
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>
                                    )}

                                    <div className="mt-3">
                                        <Card>
                                            <Card.Header>
                                                <h6 className="mb-0">Attempts</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                {remainingAttempts === null ||
                                                isNaN(remainingAttempts) ? (
                                                    <p>Unlimited Attempts</p>
                                                ) : (
                                                    <p>
                                                        {remainingAttempts} Attempt
                                                        {remainingAttempts !== 1 ? "s" : ""} Remaining
                                                    </p>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </div>

                                    {hasAttempt &&
                                    (quizState?.multipleAttempts === "Yes" ||
                                        quiz?.multipleAttempts === "Yes") ? (
                                        <div className="mt-3">
                                            <Button
                                                variant="secondary"
                                                onClick={handleViewLastAttempt}
                                                className="w-100"
                                            >
                                                View Last Attempt Results
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    ) : (
                        // quiz-taking interface
                        <>
                            {timeRemaining !== null && (
                                <Alert
                                    variant={
                                        timeRemaining < 60
                                            ? "danger"
                                            : timeRemaining < 300
                                                ? "warning"
                                                : "info"
                                    }
                                    className="mb-3"
                                >
                                    <strong>Time Remaining:</strong>{" "}
                                    {formatTimeRemaining(timeRemaining)}
                                </Alert>
                            )}

                            {startTime && (
                                <p className="mb-3">
                                    <strong>Started:</strong> {formatTime(startTime)}
                                </p>
                            )}

                            {quizQuestions.length > 0 && (
                                <div className="row">
                                    {/* MAIN COLUMN */}
                                    <div className="col-md-9">
                                        <h3
                                            className="mb-2"
                                            style={{ fontSize: "1.5rem", fontWeight: 600 }}
                                        >
                                            Quiz Instructions
                                        </h3>
                                        <hr
                                            className="mb-4"
                                            style={{ borderTop: "1px solid #000", margin: 0 }}
                                        />

                                        {quizState.oneQuestionAtATime === "Yes" ? (
                                            // ---------- SINGLE QUESTION MODE (existing behavior) ----------
                                            <>
                                                {quizQuestions[currentQuestionIndex] && (
                                                    <Card
                                                        className="mb-3"
                                                        style={{
                                                            border: "2px solid #000",
                                                            boxShadow: "none",
                                                            backgroundColor: "#fff",
                                                        }}
                                                    >
                                                        <Card.Header
                                                            className="d-flex justify-content-between align-items-center"
                                                            style={{
                                                                backgroundColor: "#e9ecef",
                                                                borderBottom: "1px solid #000",
                                                                padding: "1rem",
                                                            }}
                                                        >
                                                            <h5
                                                                className="mb-0"
                                                                style={{
                                                                    fontSize: "1.1rem",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Question {currentQuestionIndex + 1}
                                                            </h5>
                                                            <span
                                                                style={{
                                                                    fontSize: "0.9rem",
                                                                    fontWeight: "500",
                                                                }}
                                                            >
                                                                {quizQuestions[currentQuestionIndex].points}{" "}
                                                                pts
                                                            </span>
                                                        </Card.Header>
                                                        <Card.Body style={{ padding: "1.5rem" }}>
                                                            {quizQuestions[currentQuestionIndex].title && (
                                                                <div
                                                                    className="mb-2"
                                                                    style={{
                                                                        fontSize: "1.1rem",
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {
                                                                        quizQuestions[currentQuestionIndex]
                                                                            .title
                                                                    }
                                                                </div>
                                                            )}
                                                            {quizQuestions[currentQuestionIndex]
                                                                .questionHtml && (
                                                                <div
                                                                    className="mb-4"
                                                                    style={{
                                                                        fontSize: "1rem",
                                                                        lineHeight: 1.6,
                                                                    }}
                                                                >
                                                                    <div
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                            quizQuestions[
                                                                                currentQuestionIndex
                                                                                ].questionHtml,
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            {!quizQuestions[currentQuestionIndex].title &&
                                                                !quizQuestions[currentQuestionIndex]
                                                                    .questionHtml && (
                                                                    <div
                                                                        className="mb-4"
                                                                        style={{
                                                                            fontSize: "1rem",
                                                                            lineHeight: 1.6,
                                                                            color: "#999",
                                                                        }}
                                                                    >
                                                                        No question content
                                                                    </div>
                                                                )}

                                                            {quizQuestions[currentQuestionIndex].type ===
                                                                "TFQ" && (
                                                                    <Form>
                                                                        <hr
                                                                            style={{
                                                                                margin: "0.5rem 0",
                                                                                borderTop: "1px solid #000",
                                                                            }}
                                                                        />
                                                                        <Form.Check
                                                                            type="radio"
                                                                            label="True"
                                                                            name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                                                            id={`${quizQuestions[currentQuestionIndex].questionId}-true`}
                                                                            checked={
                                                                                answers[
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId
                                                                                    ] === true
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerChange(
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId,
                                                                                    true
                                                                                )
                                                                            }
                                                                            className="mb-3"
                                                                            style={{ fontSize: "1rem" }}
                                                                        />
                                                                        <hr
                                                                            style={{
                                                                                margin: "0.5rem 0",
                                                                                borderTop: "1px solid #000",
                                                                            }}
                                                                        />
                                                                        <Form.Check
                                                                            type="radio"
                                                                            label="False"
                                                                            name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                                                            id={`${quizQuestions[currentQuestionIndex].questionId}-false`}
                                                                            checked={
                                                                                answers[
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId
                                                                                    ] === false
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerChange(
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId,
                                                                                    false
                                                                                )
                                                                            }
                                                                            style={{ fontSize: "1rem" }}
                                                                        />
                                                                    </Form>
                                                                )}

                                                            {quizQuestions[currentQuestionIndex].type ===
                                                                "MCQ" && (
                                                                    <Form>
                                                                        {quizQuestions[
                                                                            currentQuestionIndex
                                                                            ].choices?.map(
                                                                            (
                                                                                choice: any,
                                                                                index: number
                                                                            ) => (
                                                                                <React.Fragment
                                                                                    key={choice._id || index}
                                                                                >
                                                                                    <hr
                                                                                        style={{
                                                                                            margin: "0.5rem 0",
                                                                                            borderTop:
                                                                                                "1px solid #000",
                                                                                        }}
                                                                                    />
                                                                                    <Form.Check
                                                                                        type="radio"
                                                                                        label={choice.text}
                                                                                        name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                                                                        id={`${quizQuestions[currentQuestionIndex].questionId}-${choice._id}`}
                                                                                        checked={
                                                                                            answers[
                                                                                                quizQuestions[
                                                                                                    currentQuestionIndex
                                                                                                    ]
                                                                                                    .questionId
                                                                                                ] ===
                                                                                            choice._id ||
                                                                                            answers[
                                                                                                quizQuestions[
                                                                                                    currentQuestionIndex
                                                                                                    ]
                                                                                                    .questionId
                                                                                                ] ===
                                                                                            choice.text
                                                                                        }
                                                                                        onChange={() =>
                                                                                            handleAnswerChange(
                                                                                                quizQuestions[
                                                                                                    currentQuestionIndex
                                                                                                    ]
                                                                                                    .questionId,
                                                                                                choice._id ||
                                                                                                choice.text
                                                                                            )
                                                                                        }
                                                                                        className={
                                                                                            index <
                                                                                            quizQuestions[
                                                                                                currentQuestionIndex
                                                                                                ].choices
                                                                                                .length -
                                                                                            1
                                                                                                ? "mb-3"
                                                                                                : ""
                                                                                        }
                                                                                        style={{
                                                                                            fontSize: "1rem",
                                                                                        }}
                                                                                    />
                                                                                </React.Fragment>
                                                                            )
                                                                        )}
                                                                    </Form>
                                                                )}

                                                            {quizQuestions[currentQuestionIndex].type ===
                                                                "FIBQ" && (
                                                                    <Form>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={
                                                                                answers[
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId
                                                                                    ] || ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleAnswerChange(
                                                                                    quizQuestions[
                                                                                        currentQuestionIndex
                                                                                        ].questionId,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Enter your answer"
                                                                            style={{ fontSize: "1rem" }}
                                                                        />
                                                                    </Form>
                                                                )}
                                                        </Card.Body>
                                                    </Card>
                                                )}

                                                <div className="d-flex justify-content-between gap-2 mb-3">
                                                    <div>
                                                        {currentQuestionIndex > 0 && (
                                                            <Button
                                                                variant="outline-secondary"
                                                                onClick={() =>
                                                                    setCurrentQuestionIndex(
                                                                        (prev) => prev - 1
                                                                    )
                                                                }
                                                            >
                                                                ◂ Previous
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {currentQuestionIndex <
                                                            quizQuestions.length - 1 && (
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        setCurrentQuestionIndex(
                                                                            (prev) => prev + 1
                                                                        )
                                                                    }
                                                                >
                                                                    Next{" "}
                                                                    <FaArrowRight className="ms-1" />
                                                                </Button>
                                                            )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            // ---------- MULTI QUESTION MODE (all questions at once) ----------
                                            <>
                                                {quizQuestions.map(
                                                    (q: any, index: number) => (
                                                        <Card
                                                            key={q.questionId}
                                                            className="mb-3"
                                                            style={{
                                                                border: "2px solid #000",
                                                                boxShadow: "none",
                                                                backgroundColor: "#fff",
                                                            }}
                                                        >
                                                            <Card.Header
                                                                className="d-flex justify-content-between align-items-center"
                                                                style={{
                                                                    backgroundColor: "#e9ecef",
                                                                    borderBottom:
                                                                        "1px solid #000",
                                                                    padding: "1rem",
                                                                }}
                                                            >
                                                                <h5
                                                                    className="mb-0"
                                                                    style={{
                                                                        fontSize: "1.1rem",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    Question {index + 1}
                                                                </h5>
                                                                <span
                                                                    style={{
                                                                        fontSize: "0.9rem",
                                                                        fontWeight: "500",
                                                                    }}
                                                                >
                                                                    {q.points} pts
                                                                </span>
                                                            </Card.Header>
                                                            <Card.Body
                                                                style={{ padding: "1.5rem" }}
                                                            >
                                                                {q.title && (
                                                                    <div
                                                                        className="mb-2"
                                                                        style={{
                                                                            fontSize: "1.1rem",
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {q.title}
                                                                    </div>
                                                                )}
                                                                {q.questionHtml && (
                                                                    <div
                                                                        className="mb-4"
                                                                        style={{
                                                                            fontSize: "1rem",
                                                                            lineHeight: 1.6,
                                                                        }}
                                                                    >
                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: q.questionHtml,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {!q.title &&
                                                                    !q.questionHtml && (
                                                                        <div
                                                                            className="mb-4"
                                                                            style={{
                                                                                fontSize: "1rem",
                                                                                lineHeight: 1.6,
                                                                                color: "#999",
                                                                            }}
                                                                        >
                                                                            No question content
                                                                        </div>
                                                                    )}

                                                                {q.type === "TFQ" && (
                                                                    <Form>
                                                                        <hr
                                                                            style={{
                                                                                margin: "0.5rem 0",
                                                                                borderTop:
                                                                                    "1px solid #000",
                                                                            }}
                                                                        />
                                                                        <Form.Check
                                                                            type="radio"
                                                                            label="True"
                                                                            name={`question-${q.questionId}`}
                                                                            id={`${q.questionId}-true`}
                                                                            checked={
                                                                                answers[q.questionId] ===
                                                                                true
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerChange(
                                                                                    q.questionId,
                                                                                    true
                                                                                )
                                                                            }
                                                                            className="mb-3"
                                                                            style={{
                                                                                fontSize: "1rem",
                                                                            }}
                                                                        />
                                                                        <hr
                                                                            style={{
                                                                                margin: "0.5rem 0",
                                                                                borderTop:
                                                                                    "1px solid #000",
                                                                            }}
                                                                        />
                                                                        <Form.Check
                                                                            type="radio"
                                                                            label="False"
                                                                            name={`question-${q.questionId}`}
                                                                            id={`${q.questionId}-false`}
                                                                            checked={
                                                                                answers[q.questionId] ===
                                                                                false
                                                                            }
                                                                            onChange={() =>
                                                                                handleAnswerChange(
                                                                                    q.questionId,
                                                                                    false
                                                                                )
                                                                            }
                                                                            style={{
                                                                                fontSize: "1rem",
                                                                            }}
                                                                        />
                                                                    </Form>
                                                                )}

                                                                {q.type === "MCQ" && (
                                                                    <Form>
                                                                        {q.choices?.map(
                                                                            (
                                                                                choice: any,
                                                                                i: number
                                                                            ) => (
                                                                                <React.Fragment
                                                                                    key={
                                                                                        choice._id || i
                                                                                    }
                                                                                >
                                                                                    <hr
                                                                                        style={{
                                                                                            margin:
                                                                                                "0.5rem 0",
                                                                                            borderTop:
                                                                                                "1px solid #000",
                                                                                        }}
                                                                                    />
                                                                                    <Form.Check
                                                                                        type="radio"
                                                                                        label={choice.text}
                                                                                        name={`question-${q.questionId}`}
                                                                                        id={`${q.questionId}-${choice._id}`}
                                                                                        checked={
                                                                                            answers[
                                                                                                q
                                                                                                    .questionId
                                                                                                ] ===
                                                                                            choice._id ||
                                                                                            answers[
                                                                                                q
                                                                                                    .questionId
                                                                                                ] ===
                                                                                            choice.text
                                                                                        }
                                                                                        onChange={() =>
                                                                                            handleAnswerChange(
                                                                                                q.questionId,
                                                                                                choice._id ||
                                                                                                choice.text
                                                                                            )
                                                                                        }
                                                                                        className={
                                                                                            i <
                                                                                            q.choices
                                                                                                .length -
                                                                                            1
                                                                                                ? "mb-3"
                                                                                                : ""
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "1rem",
                                                                                        }}
                                                                                    />
                                                                                </React.Fragment>
                                                                            )
                                                                        )}
                                                                    </Form>
                                                                )}

                                                                {q.type === "FIBQ" && (
                                                                    <Form>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={
                                                                                answers[
                                                                                    q.questionId
                                                                                    ] || ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleAnswerChange(
                                                                                    q.questionId,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Enter your answer"
                                                                            style={{
                                                                                fontSize: "1rem",
                                                                            }}
                                                                        />
                                                                    </Form>
                                                                )}
                                                            </Card.Body>
                                                        </Card>
                                                    )
                                                )}
                                            </>
                                        )}

                                        {/* bottom bar (common to both modes) */}
                                        <div
                                            className="d-flex justify-content-between align-items-center p-3"
                                            style={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #000",
                                                borderRadius: "4px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <div>
                                                {lastSaved && (
                                                    <span className="text-muted">
                                                        Quiz saved at{" "}
                                                        {formatTime(lastSaved)}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="lg"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting
                                                    ? "Submitting..."
                                                    : "Submit Quiz"}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* SIDEBAR */}
                                    <div className="col-md-3 mb-4">
                                        {quizState.oneQuestionAtATime === "Yes" && (
                                            <Card>
                                                <Card.Header>
                                                    <h6 className="mb-0">Questions</h6>
                                                </Card.Header>
                                                <Card.Body className="p-0">
                                                    <ListGroup variant="flush">
                                                        {quizQuestions.map(
                                                            (q: any, index: number) => {
                                                                const answered =
                                                                    answers[q.questionId] !==
                                                                    null &&
                                                                    answers[q.questionId] !==
                                                                    "";
                                                                return (
                                                                    <ListGroupItem
                                                                        key={q.questionId}
                                                                        action
                                                                        active={
                                                                            index ===
                                                                            currentQuestionIndex
                                                                        }
                                                                        onClick={() =>
                                                                            setCurrentQuestionIndex(
                                                                                index
                                                                            )
                                                                        }
                                                                        style={{
                                                                            color: answered
                                                                                ? "inherit"
                                                                                : "#dc3545",
                                                                            cursor: "pointer",
                                                                            backgroundColor:
                                                                                index ===
                                                                                currentQuestionIndex
                                                                                    ? "#e7f3ff"
                                                                                    : "transparent",
                                                                            borderLeft:
                                                                                index ===
                                                                                currentQuestionIndex
                                                                                    ? "4px solid #0d6efd"
                                                                                    : "none",
                                                                        }}
                                                                        className="d-flex align-items-center"
                                                                    >
                                                                        <FaQuestionCircle
                                                                            className="me-2"
                                                                            style={{
                                                                                color: "#dc3545",
                                                                            }}
                                                                        />
                                                                        Question {index + 1}
                                                                    </ListGroupItem>
                                                                );
                                                            }
                                                        )}
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        )}

                                        {remainingAttempts !== null &&
                                            !isNaN(remainingAttempts) && (
                                                <div
                                                    className="mt-3 p-3"
                                                    style={{
                                                        backgroundColor: "#f8f9fa",
                                                        borderRadius: "4px",
                                                        border: "1px solid #dee2e6",
                                                    }}
                                                >
                                                    <p
                                                        className="mb-0"
                                                        style={{
                                                            fontSize: "0.9rem",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        <strong>Retakes Left:</strong>{" "}
                                                        {remainingAttempts}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
