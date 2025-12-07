"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  InputGroup,
  Row,
  Modal,
  ListGroup,
  ListGroupItem,
  Alert,
  Form,
} from "react-bootstrap";
import { AiFillCalendar } from "react-icons/ai";
import { FaQuestionCircle, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";
import InputGroupText from "react-bootstrap/InputGroupText";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import { RootState } from "@/app/(Kambaz)/store";
import { fetchQuiz, saveQuiz, canStudentTakeQuiz, getStudentAttempt, submitQuizAttempt, getStudentAttemptCount } from "../../../../Courses/client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const isNewQuiz = qid === "new";
  const router = useRouter();
  const pathname = usePathname();
  const [quiz, setQuiz] = useState<any>(null);
  const [quizState, setQuizState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserRole = useSelector(
      // @ts-expect-error because it complains about accessing object
      (state: RootState) => state.accountReducer.currentUser?.role
  );
  const isFaculty = currentUserRole != "STUDENT";
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as any;
  const [canTake, setCanTake] = useState<any>(null);
  const [hasAttempt, setHasAttempt] = useState(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  // Quiz-taking state for students
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // in seconds

  useEffect(() => {
    if (!cid || !qid) return;

    // Reset state when quiz ID changes to prevent showing old data
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

    if (qid === "new") {
      setQuiz({});
      setQuizState({
        name: "",
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
      });
      setIsLoading(false);
    } else {
      fetchQuiz(cid, qid)
        .then((fetchedQuiz) => {
          setQuiz(fetchedQuiz);
          setQuizState({
            name: fetchedQuiz.name,
            points: fetchedQuiz.points || 0,
            quizType: fetchedQuiz.quizType || "Graded Quiz",
            assignmentGroup: fetchedQuiz.assignmentGroup || "Quizzes",
            shuffleAnswers: fetchedQuiz.shuffleAnswers || "Yes",
            timeLimit: fetchedQuiz.timeLimit || 20,
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
            description: fetchedQuiz.description || "",
          });
          // Load questions for students
          if (!isFaculty && fetchedQuiz.questions) {
            setQuizQuestions(fetchedQuiz.questions);
            const initialAnswers: Record<string, any> = {};
            fetchedQuiz.questions.forEach((q: any) => {
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
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [cid, qid, isFaculty]);

  const initialBlankState = {
    name: "",
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

  // Check if student can take quiz and if they have an attempt
  useEffect(() => {
    if (!isFaculty && !isNewQuiz && cid && qid && currentUser?._id && !isLoading && quizState) {
      const checkQuizAccess = async () => {
        try {
          const canTakeResult = await canStudentTakeQuiz(cid as string, qid as string, currentUser._id);
          setCanTake(canTakeResult);
          
          // Get attempt count
          try {
            const result = await getStudentAttemptCount(cid as string, qid as string, currentUser._id);
            // The API returns { count: number }, extract the count
            const count = typeof result === 'object' && result !== null && 'count' in result 
              ? result.count 
              : (typeof result === 'number' ? result : 0);
            setAttemptCount(count);
          } catch (error: any) {
            console.error("Failed to get attempt count:", error);
            setAttemptCount(0);
          }
          
          // Get attempt regardless of canTake status (for viewing results)
          let attempt = null;
          try {
            attempt = await getStudentAttempt(cid as string, qid as string, currentUser._id);
            setHasAttempt(attempt !== null);
          } catch (error: any) {
            // 404 is expected if no attempt exists yet, so we ignore it
            if (error?.response?.status !== 404) {
              console.error("Failed to get student attempt:", error);
            }
            setHasAttempt(false);
          }
          
          // Calculate remaining attempts
          const multipleAttempts = quizState?.multipleAttempts || quiz?.multipleAttempts;
          const howManyAttemptsRaw = quizState?.howManyAttempts || quiz?.howManyAttempts;
          // Convert to number and ensure it's valid
          const howManyAttempts = howManyAttemptsRaw ? Number(howManyAttemptsRaw) : null;
          // Ensure attemptCount is a valid number
          const validAttemptCount = typeof attemptCount === 'number' && !isNaN(attemptCount) ? attemptCount : 0;
          
          let remaining: number | null;
          // If multipleAttempts is explicitly 'No' or false, treat as single attempt
          if (multipleAttempts === 'No' || multipleAttempts === false) {
            remaining = attempt ? 0 : 1;
          } else if (multipleAttempts === 'Yes' || multipleAttempts === true) {
            if (howManyAttempts && !isNaN(howManyAttempts) && howManyAttempts > 0) {
              const calculated = howManyAttempts - validAttemptCount;
              remaining = isNaN(calculated) ? null : Math.max(0, calculated);
            } else {
              remaining = null; // Unlimited
            }
          } else {
            // Default to single attempt if not specified
            remaining = attempt ? 0 : 1;
          }
          setRemainingAttempts(remaining);
          
          // If no attempts left and student has taken the quiz, automatically show results
          if (remaining === 0 && attempt && !hasStarted && !isSubmitted) {
            setSubmissionResult(attempt);
            setIsSubmitted(true);
            setHasStarted(false);
          } else if (attempt && multipleAttempts === 'No' && !hasStarted && !isSubmitted) {
            // If quiz doesn't allow multiple attempts and student has already taken it, automatically show results
            setSubmissionResult(attempt);
            setIsSubmitted(true);
            setHasStarted(false);
          }
        } catch (error) {
          console.error("Failed to check quiz access:", error);
          setCanTake({ canTake: false, reason: "Failed to check quiz availability" });
        }
      };
      checkQuizAccess();
    }
  }, [isFaculty, isNewQuiz, cid, qid, currentUser, quizState?.multipleAttempts, quiz?.multipleAttempts, quizState?.howManyAttempts, quiz?.howManyAttempts, hasStarted, isSubmitted, isLoading, quizState, attemptCount]);

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
    if (timeRemaining === 0 && hasStarted && !isSubmitted && !isSubmitting && cid && qid && currentUser?._id) {
      const autoSubmit = async () => {
        setIsSubmitting(true);
        try {
          const result = await submitQuizAttempt(cid as string, qid as string, currentUser._id, answers);
          const attempt = await getStudentAttempt(cid as string, qid as string, currentUser._id);
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
  }, [timeRemaining, hasStarted, isSubmitted, isSubmitting, cid, qid, currentUser, answers]);

  if (isLoading || !quizState) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Block students from accessing unpublished quizzes
  if (!isFaculty && quiz && quiz.published === false) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="text-center">
          <h3>Quiz Not Available</h3>
          <p className="mt-3">This quiz is not published and is not available for students.</p>
          <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    // Build the updated quiz object, ensuring all fields are explicitly included
    const updatedQuiz: any = {
      name: quizState.name || "",
      points: quizState.points || 0,
      quizType: quizState.quizType || "Graded Quiz",
      assignmentGroup: quizState.assignmentGroup || "Quizzes",
      shuffleAnswers: quizState.shuffleAnswers || "Yes",
      timeLimit: quizState.timeLimit || 20,
      multipleAttempts: quizState.multipleAttempts || "No",
      howManyAttempts: quizState.multipleAttempts === "Yes" 
        ? (quizState.howManyAttempts || 1) 
        : (quizState.multipleAttempts === "No" ? 1 : quizState.howManyAttempts || 1),
      showCorrectAnswers: quizState.showCorrectAnswers || "No",
      accessCode: quizState.accessCode || "",
      oneQuestionAtATime: quizState.oneQuestionAtATime || "Yes",
      webcamRequired: quizState.webcamRequired || "No",
      lockQuestionsAfterAnswering: quizState.lockQuestionsAfterAnswering || "No",
      due_date: quizState.due_date || "",
      available_date: quizState.available_date || "",
      available_until: quizState.until_date || "",
      description: quizState.description || "",
      published: quizState.published !== undefined ? quizState.published : (quiz?.published || false),
    };

    console.log("Saving quiz with data:", updatedQuiz);
    console.log("Description value:", updatedQuiz.description);
    console.log("Multiple Attempts:", updatedQuiz.multipleAttempts);
    console.log("How Many Attempts:", updatedQuiz.howManyAttempts);

    let saved;
    if (qid === "new") {
      saved = await saveQuiz(cid, undefined, updatedQuiz); // server interprets undefined qid as create
    } else {
      saved = await saveQuiz(cid, qid, updatedQuiz); // update existing
    }

    console.log("Saved quiz response:", saved);
    console.log("Saved description:", saved?.description);
    console.log("Saved howManyAttempts:", saved?.howManyAttempts);

    setQuiz(saved);
    // Update quizState with saved data to ensure description and howManyAttempts are synced
    setQuizState(saved);
    setShowSavedModal(true);
  };

  // Quiz-taking handlers for students
  const handleStart = async () => {
    // Double-check that student can take quiz before starting
    if (canTake && !canTake.canTake) {
      alert(canTake.reason || "You cannot take this quiz at this time.");
      return;
    }
    
    // Check remaining attempts before starting
    if (remainingAttempts !== null && remainingAttempts <= 0) {
      alert("You have reached the maximum number of attempts for this quiz.");
      return;
    }
    
    // Refresh attempt count from backend before decrementing
    if (!isFaculty && currentUser?._id && cid && qid) {
      try {
        const currentCountResult = await getStudentAttemptCount(cid as string, qid as string, currentUser._id);
        // The API returns { count: number }, extract the count
        const currentCount = typeof currentCountResult === 'object' && currentCountResult !== null && 'count' in currentCountResult 
          ? currentCountResult.count 
          : (typeof currentCountResult === 'number' ? currentCountResult : 0);
        setAttemptCount(currentCount);
        
        // Recalculate remaining attempts based on fresh backend data
        const multipleAttempts = quizState?.multipleAttempts || quiz?.multipleAttempts;
        const howManyAttemptsRaw = quizState?.howManyAttempts || quiz?.howManyAttempts;
        const howManyAttempts = howManyAttemptsRaw ? Number(howManyAttemptsRaw) : null;
        const validAttemptCount = typeof currentCount === 'number' && !isNaN(currentCount) ? currentCount : 0;
        
        let newRemaining: number | null;
        if (multipleAttempts === 'No' || multipleAttempts === false) {
          newRemaining = validAttemptCount > 0 ? 0 : 1;
        } else if (multipleAttempts === 'Yes' || multipleAttempts === true) {
          if (howManyAttempts && !isNaN(howManyAttempts) && howManyAttempts > 0) {
            const calculated = howManyAttempts - validAttemptCount;
            newRemaining = isNaN(calculated) ? null : Math.max(0, calculated);
          } else {
            newRemaining = null; // Unlimited
          }
        } else {
          newRemaining = validAttemptCount > 0 ? 0 : 1;
        }
        
        // Check if they can still take it after refresh
        if (newRemaining !== null && newRemaining <= 0) {
          alert("You have reached the maximum number of attempts for this quiz.");
          return;
        }
        
        // Decrement remaining attempts when starting the quiz
        if (newRemaining !== null && newRemaining > 0) {
          setRemainingAttempts(newRemaining - 1);
          setAttemptCount(prev => prev + 1);
        } else {
          setRemainingAttempts(newRemaining);
        }
        
        // Dispatch custom event to notify quizzes list page
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('quizAttemptStarted', {
            detail: { quizId: qid, courseId: cid }
          }));
        }
      } catch (error) {
        console.error("Failed to refresh attempt count before starting:", error);
        // Still allow starting if refresh fails, but use current state
        if (remainingAttempts !== null && remainingAttempts > 0) {
          setRemainingAttempts(remainingAttempts - 1);
          setAttemptCount(prev => prev + 1);
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('quizAttemptStarted', {
              detail: { quizId: qid, courseId: cid }
            }));
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
      const attempt = await getStudentAttempt(cid as string, qid as string, currentUser._id);
      if (attempt) {
        setSubmissionResult(attempt);
        setIsSubmitted(true);
        setHasStarted(false); // Make sure we're not in quiz-taking mode
        // Scroll to top to show results
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Failed to load last attempt:", error);
      alert("Failed to load your last attempt. Please try again.");
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
    setLastSaved(new Date());
  };

  const handleSubmit = async () => {
    if (!cid || !qid || !currentUser?._id) {
      alert("Missing required information. Please refresh the page and try again.");
      return;
    }
    
    // Validate that we have answers (even if some are empty)
    if (!answers || Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Submitting quiz with:", { 
        cid, 
        qid, 
        studentId: currentUser._id, 
        answersCount: Object.keys(answers).length,
        answers 
      });
      
      const result = await submitQuizAttempt(cid as string, qid as string, currentUser._id, answers);
      console.log("Quiz submitted successfully, result:", result);
      
      // Wait a bit for the backend to process, then fetch the attempt
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const attempt = await getStudentAttempt(cid as string, qid as string, currentUser._id);
      console.log("Attempt fetched:", attempt);
      
      if (!attempt) {
        throw new Error("Failed to retrieve quiz attempt after submission");
      }
      
      setSubmissionResult(attempt);
      setIsSubmitted(true);
      
      // Refresh attempt count and canTake status after submission
      try {
        const newCountResult = await getStudentAttemptCount(cid as string, qid as string, currentUser._id);
        // The API returns { count: number }, extract the count
        const newCount = typeof newCountResult === 'object' && newCountResult !== null && 'count' in newCountResult 
          ? newCountResult.count 
          : (typeof newCountResult === 'number' ? newCountResult : 0);
        setAttemptCount(newCount);
        
        // Refresh canTake status
        const canTakeResult = await canStudentTakeQuiz(cid as string, qid as string, currentUser._id);
        setCanTake(canTakeResult);
        
        // Recalculate remaining attempts
        const multipleAttempts = quizState?.multipleAttempts || quiz?.multipleAttempts;
        const howManyAttemptsRaw = quizState?.howManyAttempts || quiz?.howManyAttempts;
        const howManyAttempts = howManyAttemptsRaw ? Number(howManyAttemptsRaw) : null;
        const validAttemptCount = typeof newCount === 'number' && !isNaN(newCount) ? newCount : 0;
        
        let newRemaining: number | null;
        if (multipleAttempts === 'No' || multipleAttempts === false) {
          newRemaining = 0; // Already taken, no more attempts
        } else if (multipleAttempts === 'Yes' || multipleAttempts === true) {
          if (howManyAttempts && !isNaN(howManyAttempts) && howManyAttempts > 0) {
            const calculated = howManyAttempts - validAttemptCount;
            newRemaining = isNaN(calculated) ? null : Math.max(0, calculated);
          } else {
            newRemaining = null; // Unlimited
          }
        } else {
          // Default to single attempt
          newRemaining = 0;
        }
        setRemainingAttempts(newRemaining);
        
        // Dispatch event to update quizzes list page
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('quizAttemptStarted', {
            detail: { quizId: qid, courseId: cid }
          }));
        }
      } catch (error) {
        console.error("Failed to refresh attempt count:", error);
      }
      
      // Scroll to top to show results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Failed to submit quiz - Full error:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          "Unknown error occurred";
      alert(`Failed to submit quiz: ${errorMessage}\n\nPlease check the browser console for more details.`);
    } finally {
      setIsSubmitting(false);
    }
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

  const isAnswerCorrect = (question: any): boolean => {
    if (!submissionResult) return false;
    const userAnswer = submissionResult.answers[question.questionId];
    
    // Use the same logic as the backend - exact match
    if (question.type === 'TFQ') {
      // Backend: userAnswer !== null && userAnswer !== undefined && userAnswer === question.correctAnswer
      if (userAnswer === null || userAnswer === undefined) return false;
      // Normalize both to boolean for comparison (handle string "true"/"false" or boolean true/false)
      const userBool = userAnswer === true || userAnswer === 'true' || String(userAnswer).toLowerCase() === 'true';
      const correctBool = question.correctAnswer === true || question.correctAnswer === 'true' || String(question.correctAnswer).toLowerCase() === 'true';
      return userBool === correctBool;
    } else if (question.type === 'MCQ') {
      // Backend: userAnswer !== null && userAnswer !== undefined, then check choice
      if (userAnswer === null || userAnswer === undefined) return false;
      const correctChoice = question.choices?.find((c: any) => c.isCorrect);
      if (!correctChoice) return false;
      // Backend: Compare both by _id and text, with string normalization
      const userAnswerStr = String(userAnswer).trim();
      const correctIdStr = String(correctChoice._id || '').trim();
      const correctTextStr = String(correctChoice.text || '').trim();
      return userAnswerStr === correctIdStr || userAnswerStr === correctTextStr || 
             userAnswer === correctChoice._id || userAnswer === correctChoice.text;
    } else if (question.type === 'FIBQ') {
      // Backend: userAnswer && typeof question.correctAnswer === 'string', then trim and lowercase
      if (!userAnswer || typeof question.correctAnswer !== 'string') return false;
      return String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    }
    return false;
  };

  const getQuestionScore = (question: any): number => {
    if (!submissionResult) return 0;
    const isCorrect = isAnswerCorrect(question);
    return isCorrect ? question.points : 0;
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

  return (
    <div className="p-4">
      {/* Quiz Tabs - Only show for faculty */}
      {isFaculty && (
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
      )}

      {isFaculty && <h2>Quiz Details</h2>}
      {isFaculty ? (
        <div className="d-flex flex-column gap-3">
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Quiz Name
            </FormLabel>
            <Col sm={8}>
              <FormControl
                type="text"
                value={quizState.name}
                onChange={(e) =>
                  setQuizState({ ...quizState, name: e.target.value })
                }
                placeholder="Quiz"
              />
            </Col>
          </FormGroup>
          {/* Editable form for faculty */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Quiz Type
            </FormLabel>
            <Col sm={8}>
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

          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Points
            </FormLabel>
            <Col sm={8}>
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

          {/* Assignment Group */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Assignment Group
            </FormLabel>
            <Col sm={8}>
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

          {/* Shuffle Answers */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Shuffle Answers
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.shuffleAnswers}
                onChange={(e) =>
                  setQuizState({ ...quizState, shuffleAnswers: e.target.value })
                }
              >
                <option>Yes</option>
                <option>No</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {/* Time Limit */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Time Limit (Minutes)
            </FormLabel>
            <Col sm={8}>
              <FormControl
                type="number"
                value={quizState.timeLimit ?? 0}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    timeLimit: parseInt(e.target.value) || 20,
                  })
                }
              />
            </Col>
          </FormGroup>

          {/* Multiple Attempts */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Multiple Attempts
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.multipleAttempts}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    multipleAttempts: e.target.value,
                  })
                }
              >
                <option>No</option>
                <option>Yes</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {quizState.multipleAttempts === "Yes" && (
            <FormGroup as={Row}>
              <FormLabel column sm={4}>
                How Many Attempts
              </FormLabel>
              <Col sm={8}>
                <FormControl
                  type="number"
                  value={quizState.howManyAttempts}
                  onChange={(e) =>
                    setQuizState({
                      ...quizState,
                      howManyAttempts: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Col>
            </FormGroup>
          )}

          {/* Show Correct Answers */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Show Correct Answers
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.showCorrectAnswers}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    showCorrectAnswers: e.target.value,
                  })
                }
              >
                <option>No</option>
                <option>Immediately</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {/* Access Code */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Access Code
            </FormLabel>
            <Col sm={8}>
              <FormControl
                type="text"
                value={quizState.accessCode}
                onChange={(e) =>
                  setQuizState({ ...quizState, accessCode: e.target.value })
                }
                placeholder="Optional"
              />
            </Col>
          </FormGroup>

          {/* One Question at a Time */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              One Question at a Time
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.oneQuestionAtATime}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    oneQuestionAtATime: e.target.value,
                  })
                }
              >
                <option>Yes</option>
                <option>No</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {/* Webcam Required */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Webcam Required
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.webcamRequired}
                onChange={(e) =>
                  setQuizState({ ...quizState, webcamRequired: e.target.value })
                }
              >
                <option>No</option>
                <option>Yes</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {/* Lock Questions After Answering */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Lock Questions After Answering
            </FormLabel>
            <Col sm={8}>
              <FormSelect
                value={quizState.lockQuestionsAfterAnswering}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    lockQuestionsAfterAnswering: e.target.value,
                  })
                }
              >
                <option>No</option>
                <option>Yes</option>
              </FormSelect>
            </Col>
          </FormGroup>

          {/* Dates */}
          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Due Date
            </FormLabel>
            <Col sm={8}>
              <InputGroup>
                <FormControl
                  type="date"
                  value={quizState.due_date}
                  onChange={(e) =>
                    setQuizState({ ...quizState, due_date: e.target.value })
                  }
                />
                <InputGroupText>
                  <AiFillCalendar />
                </InputGroupText>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Available Date
            </FormLabel>
            <Col sm={8}>
              <InputGroup>
                <FormControl
                  type="date"
                  value={quizState.available_date}
                  onChange={(e) =>
                    setQuizState({
                      ...quizState,
                      available_date: e.target.value,
                    })
                  }
                />
                <InputGroupText>
                  <AiFillCalendar />
                </InputGroupText>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Until Date
            </FormLabel>
            <Col sm={8}>
              <InputGroup>
                <FormControl
                  type="date"
                  value={quizState.until_date}
                  onChange={(e) =>
                    setQuizState({ ...quizState, until_date: e.target.value })
                  }
                />
                <InputGroupText>
                  <AiFillCalendar />
                </InputGroupText>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup as={Row}>
            <FormLabel column sm={4}>
              Description
            </FormLabel>
            <Col sm={8}>
              <FormControl
                as="textarea"
                rows={6}
                value={quizState.description || ''}
                onChange={(e) =>
                  setQuizState({ ...quizState, description: e.target.value })
                }
                placeholder="Enter quiz description (supports HTML)"
              />
            </Col>
          </FormGroup>

          <div className="mt-3 d-flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
            {!isNewQuiz && (
              <>
                <Button
                  variant={quiz?.published ? "secondary" : "success"}
                  onClick={async () => {
                    if (!quiz) return;
                    const updated = await saveQuiz(cid, qid, {
                      ...quizState,
                      published: !quiz.published,
                      available_until: quizState.until_date,
                    });
                    setQuiz(updated);
                    setQuizState({
                      ...quizState,
                      published: updated.published,
                    });
                  }}
                >
                  {quiz?.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  variant="outline-info"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
                >
                  Preview Quiz
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4" style={{backgroundColor: '#fff', minHeight: '100vh'}}>
          <h2 className="mb-3">{quizState.name || quiz?.name || 'Quiz'}</h2>

          {isSubmitted && submissionResult ? (
            // Results display - all questions with scores (read-only)
            <>
              <Card className="mb-4">
                <Card.Header className="bg-secondary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">Final Score: {submissionResult.score} / {submissionResult.totalPoints} ({Math.round((submissionResult.score / submissionResult.totalPoints) * 100)}%)</h4>
                      {submissionResult.submittedAt && (
                        <p className="mb-0 mt-2" style={{fontSize: '0.9rem', opacity: 0.9}}>
                          Submitted: {formatTime(new Date(submissionResult.submittedAt))}
                        </p>
                      )}
                    </div>
                    {/* Show Retake Quiz button if there are remaining attempts or unlimited attempts */}
                    {(remainingAttempts === null || remainingAttempts > 0) && (
                      <Button 
                        variant="danger" 
                        size="lg"
                        onClick={() => {
                          setHasStarted(false);
                          setIsSubmitted(false);
                          setSubmissionResult(null);
                          setCurrentQuestionIndex(0);
                          // Reset answers
                          const initialAnswers: Record<string, any> = {};
                          quizQuestions.forEach((q: any) => {
                            if (q.type === 'TFQ') {
                              initialAnswers[q.questionId] = null;
                            } else if (q.type === 'MCQ') {
                              initialAnswers[q.questionId] = null;
                            } else if (q.type === 'FIBQ') {
                              initialAnswers[q.questionId] = '';
                            }
                          });
                          setAnswers(initialAnswers);
                          // Reset timer if needed
                          if (quizState.timeLimit) {
                            setTimeRemaining(quizState.timeLimit * 60);
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Retake Quiz
                      </Button>
                    )}
                  </div>
                </Card.Header>
              </Card>

              {quizQuestions.map((question: any, index: number) => {
                const isCorrect = isAnswerCorrect(question);
                const userAnswer = submissionResult.answers[question.questionId];
                const questionScore = getQuestionScore(question);

                return (
                  <Card key={question.questionId} className="mb-3" style={{border: '2px solid #000', boxShadow: 'none', backgroundColor: '#fff'}}>
                    <Card.Header className="d-flex justify-content-between align-items-center" style={{backgroundColor: '#e9ecef', borderBottom: '1px solid #000', padding: '1rem'}}>
                      <div className="d-flex align-items-center gap-2">
                        {isCorrect ? (
                          <FaCheck className="fs-5" style={{color: '#28a745'}} />
                        ) : (
                          <FaTimes className="fs-5" style={{color: '#dc3545'}} />
                        )}
                        <h5 className="mb-0" style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Question {index + 1}</h5>
                      </div>
                      <span style={{fontSize: '0.9rem', fontWeight: '500'}}>{questionScore} / {question.points} pts</span>
                    </Card.Header>
                    <Card.Body style={{padding: '1.5rem'}}>
                      {question.title && (
                        <h5 className="mb-3" style={{fontWeight: 'bold'}}>{question.title}</h5>
                      )}
                      <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6'}}>
                        <div dangerouslySetInnerHTML={{__html: question.questionHtml || ''}} />
                      </div>

                      {question.type === 'TFQ' && (
                        <div>
                          <p className="mb-3"><strong>Your Answer:</strong> {userAnswer === true ? 'True' : userAnswer === false ? 'False' : 'Not answered'}</p>
                          <div className="mb-2">
                            <hr style={{margin: '0.5rem 0'}} />
                            {['True', 'False'].map((option) => {
                              // Normalize userAnswer to boolean
                              const userBool = userAnswer === true || userAnswer === 'true' || String(userAnswer).toLowerCase() === 'true';
                              // Normalize correctAnswer to boolean
                              const correctBool = question.correctAnswer === true || question.correctAnswer === 'true' || String(question.correctAnswer).toLowerCase() === 'true';
                              
                              const isUserAnswer = (userBool && option === 'True') || (!userBool && option === 'False');
                              const isCorrectAnswer = (correctBool && option === 'True') || (!correctBool && option === 'False');
                              const isWrongAnswer = isUserAnswer && !isCorrectAnswer;
                              
                              return (
                                <div
                                  key={option}
                                  style={{
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    backgroundColor: isCorrectAnswer ? '#d4edda' : isWrongAnswer ? '#f8d7da' : 'transparent',
                                    border: '1px solid',
                                    borderColor: isCorrectAnswer ? '#28a745' : isWrongAnswer ? '#dc3545' : '#dee2e6',
                                    borderRadius: '4px'
                                  }}
                                >
                                  {option}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {question.type === 'MCQ' && (
                        <div>
                          <p className="mb-3"><strong>Your Answer:</strong> {
                            question.choices?.find((c: any) => c._id === userAnswer || c.text === userAnswer)?.text || userAnswer || 'Not answered'
                          }</p>
                          <div className="mb-2">
                            {question.choices?.map((choice: any, choiceIndex: number) => {
                              const isUserAnswer = userAnswer === choice._id || userAnswer === choice.text;
                              const isCorrectAnswer = choice.isCorrect;
                              const isWrongAnswer = isUserAnswer && !isCorrectAnswer;
                              
                              return (
                                <div key={choice._id || choiceIndex}>
                                  <hr style={{margin: '0.5rem 0'}} />
                                  <div
                                    style={{
                                      padding: '0.75rem',
                                      marginBottom: '0.5rem',
                                      backgroundColor: isCorrectAnswer ? '#d4edda' : isWrongAnswer ? '#f8d7da' : 'transparent',
                                      border: '1px solid',
                                      borderColor: isCorrectAnswer ? '#28a745' : isWrongAnswer ? '#dc3545' : '#dee2e6',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    {choice.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {question.type === 'FIBQ' && (
                        <div>
                          <p className="mb-2"><strong>Your Answer:</strong> {userAnswer || 'Not answered'}</p>
                          {!isCorrect && (
                            <p className="mb-2"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </>
          ) : !hasStarted ? (
            // Start screen with description (only show if not submitted and has remaining attempts)
            <>
              <div className="row">
                <div className="col-md-9">
                  <Card className="mb-4" style={{border: '2px solid #000', boxShadow: 'none', backgroundColor: '#fff'}}>
                    <Card.Body style={{padding: '1.5rem'}}>
                      {((quizState?.description && quizState.description.trim() !== '') || 
                        (quiz?.description && quiz.description.trim() !== '')) ? (
                        <div dangerouslySetInnerHTML={{__html: quizState?.description || quiz?.description || ''}} />
                      ) : (
                        <p>No description</p>
                      )}
                    </Card.Body>
                  </Card>
                  
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
                          {canTake.reason || 'Cannot take quiz'}
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
                              style={{
                                cursor: 'default'
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
                  )}
                  
                  {/* Display remaining attempts */}
                  <div className="mt-3">
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Attempts</h6>
                      </Card.Header>
                      <Card.Body>
                        {remainingAttempts === null || isNaN(remainingAttempts) ? (
                          <p>Unlimited Attempts</p>
                        ) : (
                          <p>{remainingAttempts} Attempt{remainingAttempts !== 1 ? 's' : ''} Remaining</p>
                        )}
                      </Card.Body>
                    </Card>
                  </div>

                  {hasAttempt && (
                    (quizState?.multipleAttempts === 'Yes') || 
                    (quiz?.multipleAttempts === 'Yes')
                  ) ? (
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
            // Quiz-taking interface
            <>
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

              {quizQuestions.length > 0 && (
                <div className="row">
                  {/* Main Content Area */}
                  <div className="col-md-9">
                    {/* Quiz Instructions heading - prominent with line underneath */}
                    <h3 className="mb-2" style={{fontSize: '1.5rem', fontWeight: '600'}}>Quiz Instructions</h3>
                    <hr className="mb-4" style={{borderTop: '1px solid #000', margin: '0'}} />

                    {quizQuestions[currentQuestionIndex] && (
                      <Card className="mb-3" style={{border: '2px solid #000', boxShadow: 'none', backgroundColor: '#fff'}}>
                        <Card.Header
                          className="d-flex justify-content-between align-items-center"
                          style={{backgroundColor: '#e9ecef', borderBottom: '1px solid #000', padding: '1rem'}}
                        >
                          <h5 className="mb-0" style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Question {currentQuestionIndex + 1}</h5>
                          <span style={{fontSize: '0.9rem', fontWeight: '500'}}>{quizQuestions[currentQuestionIndex].points} pts</span>
                        </Card.Header>
                        <Card.Body style={{padding: '1.5rem'}}>
                          {quizQuestions[currentQuestionIndex].title && (
                            <div className="mb-2" style={{fontSize: '1.1rem', fontWeight: '600'}}>
                              {quizQuestions[currentQuestionIndex].title}
                            </div>
                          )}
                          {quizQuestions[currentQuestionIndex].questionHtml && (
                            <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6'}}>
                              <div dangerouslySetInnerHTML={{__html: quizQuestions[currentQuestionIndex].questionHtml}} />
                            </div>
                          )}
                          {!quizQuestions[currentQuestionIndex].title && !quizQuestions[currentQuestionIndex].questionHtml && (
                            <div className="mb-4" style={{fontSize: '1rem', lineHeight: '1.6', color: '#999'}}>
                              No question content
                            </div>
                          )}

                          {quizQuestions[currentQuestionIndex].type === 'TFQ' && (
                            <Form>
                              <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                              <Form.Check
                                type="radio"
                                label="True"
                                name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                id={`${quizQuestions[currentQuestionIndex].questionId}-true`}
                                checked={answers[quizQuestions[currentQuestionIndex].questionId] === true}
                                onChange={() => handleAnswerChange(quizQuestions[currentQuestionIndex].questionId, true)}
                                className="mb-3"
                                style={{fontSize: '1rem'}}
                              />
                              <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                              <Form.Check
                                type="radio"
                                label="False"
                                name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                id={`${quizQuestions[currentQuestionIndex].questionId}-false`}
                                checked={answers[quizQuestions[currentQuestionIndex].questionId] === false}
                                onChange={() => handleAnswerChange(quizQuestions[currentQuestionIndex].questionId, false)}
                                style={{fontSize: '1rem'}}
                              />
                            </Form>
                          )}

                          {quizQuestions[currentQuestionIndex].type === 'MCQ' && (
                            <Form>
                              {quizQuestions[currentQuestionIndex].choices?.map((choice: any, index: number) => (
                                <React.Fragment key={choice._id}>
                                  <hr style={{margin: '0.5rem 0', borderTop: '1px solid #000'}} />
                                  <Form.Check
                                    type="radio"
                                    label={choice.text}
                                    name={`question-${quizQuestions[currentQuestionIndex].questionId}`}
                                    id={`${quizQuestions[currentQuestionIndex].questionId}-${choice._id}`}
                                    checked={answers[quizQuestions[currentQuestionIndex].questionId] === choice._id ||
                                            answers[quizQuestions[currentQuestionIndex].questionId] === choice.text}
                                    onChange={() => handleAnswerChange(
                                      quizQuestions[currentQuestionIndex].questionId,
                                      choice._id || choice.text
                                    )}
                                    className={index < quizQuestions[currentQuestionIndex].choices.length - 1 ? "mb-3" : ""}
                                    style={{fontSize: '1rem'}}
                                  />
                                </React.Fragment>
                              ))}
                            </Form>
                          )}

                          {quizQuestions[currentQuestionIndex].type === 'FIBQ' && (
                            <Form>
                              <Form.Control
                                type="text"
                                value={answers[quizQuestions[currentQuestionIndex].questionId] || ''}
                                onChange={(e) => handleAnswerChange(quizQuestions[currentQuestionIndex].questionId, e.target.value)}
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
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          >
                            ◂ Previous
                          </Button>
                        )}
                      </div>
                      <div>
                        {currentQuestionIndex < quizQuestions.length - 1 && (
                          <Button
                            variant="secondary"
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                      </Button>
                    </div>
                  </div>

                  {/* Right Sidebar - Questions */}
                  <div className="col-md-3 mb-4">
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Questions</h6>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <ListGroup variant="flush">
                          {quizQuestions.map((q: any, index: number) => {
                            const isAnswered = answers[q.questionId] !== null && answers[q.questionId] !== '';
                            return (
                              <ListGroupItem
                                key={q.questionId}
                                action
                                active={index === currentQuestionIndex}
                                onClick={() => setCurrentQuestionIndex(index)}
                                style={{
                                  color: (answers[q.questionId] === null || answers[q.questionId] === '') ? '#dc3545' : 'inherit',
                                  cursor: 'pointer',
                                  backgroundColor: index === currentQuestionIndex ? '#e7f3ff' : 'transparent',
                                  borderLeft: index === currentQuestionIndex ? '4px solid #0d6efd' : 'none'
                                }}
                                className="d-flex align-items-center"
                              >
                                <FaQuestionCircle className="me-2" style={{color: '#dc3545'}} />
                                Question {index + 1}
                              </ListGroupItem>
                            );
                          })}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                    
                    {/* Show remaining attempts during quiz taking */}
                    {remainingAttempts !== null && !isNaN(remainingAttempts) && (
                      <div className="mt-3 p-3" style={{backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6'}}>
                        <p className="mb-0" style={{fontSize: '0.9rem', fontWeight: '500'}}>
                          <strong>Retakes Left:</strong> {remainingAttempts}
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

      {/* Saved Modal */}
      <Modal show={showSavedModal} onHide={() => setShowSavedModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your quiz has been saved successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShowSavedModal(false);
            router.back();
          }}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
