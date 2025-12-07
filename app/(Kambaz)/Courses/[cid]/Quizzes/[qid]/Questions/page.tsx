"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  fetchQuestions,
  updateQuestion,
  createQuestion,
  fetchQuiz,
} from "../../../../../Courses/client";
import { useRouter } from "next/navigation";
import { Button, Modal } from "react-bootstrap";
import QuestionItem from "./QuestionItem";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";

export default function QuizQuestionsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quizPoints, setQuizPoints] = useState<number>(0);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as any;
  const isFacultyOrAdmin =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (cid && qid) {
          const [questionsData, quizData] = await Promise.all([
            fetchQuestions(cid as string, qid as string).catch(() => []),
            fetchQuiz(cid as string, qid as string).catch(() => null)
          ]);
          setQuestions(questionsData || []);
          // Only set quiz points if it's a valid number greater than or equal to 0
          const points = quizData?.points;
          if (points !== undefined && points !== null && !isNaN(points) && points >= 0) {
            setQuizPoints(points);
          } else {
            setQuizPoints(0);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setQuestions([]);
        setQuizPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (cid && qid) {
      loadData();
    }
  }, [cid, qid]);

  const totalPoints =
    questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;

  const handleAddQuestion = () => {
    const newQuestionId = uuidv4();
    const newQuestion = {
      questionId: newQuestionId,
      title: "New Question",
      type: "MCQ",
      points: 0,
      questionHtml: "",
      choices: [
        { _id: uuidv4(), text: "Option 1", isCorrect: true },
        { _id: uuidv4(), text: "Option 2", isCorrect: false },
        { _id: uuidv4(), text: "Option 3", isCorrect: false },
        { _id: uuidv4(), text: "Option 4", isCorrect: false },
      ],
      correctAnswer: "Option 1",
    };

    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestionId); // Automatically set new question to editing mode
  };

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
  };

  const handleSaveQuestion = async (updatedQuestion: any) => {
    const updated = [...questions];
    const index = updated.findIndex(
      (q) => q.questionId === updatedQuestion.questionId
    );
    if (index !== -1) {
      updated[index] = updatedQuestion;
      setQuestions(updated);
    }
    setEditingQuestionId(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  const handleSaveQuiz = async () => {
    if (!cid || !qid) return;
    
    // Validate that total question points equals quiz points (only if quiz points is set)
    const totalQuestionPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    
    if (quizPoints > 0 && totalQuestionPoints !== quizPoints) {
      setModalTitle("Validation Error");
      setModalMessage(`The total points for all questions (${totalQuestionPoints}) must equal the quiz points (${quizPoints}) set in Details.`);
      setShowSavedModal(true);
      return;
    }
    
    if (quizPoints <= 0) {
      setModalTitle("Validation Error");
      setModalMessage("Please set the quiz points in the Details tab before saving questions.");
      setShowSavedModal(true);
      return;
    }
    
    try {
      for (const question of questions) {
        if (question._id) {
          await updateQuestion(
            cid as string,
            qid as string,
            question.questionId,
            question
          );
        } else {
          const savedQuestion = await createQuestion(
            cid as string,
            qid as string,
            question
          );

          const updated = [...questions];
          const index = updated.findIndex(
            (q) => q.questionId === question.questionId
          );
          if (index !== -1) {
            updated[index] = { ...savedQuestion, questionId: question.questionId };
            setQuestions(updated);
          }
        }
      }
      
      const data = await fetchQuestions(cid as string, qid as string);
      setQuestions(data);
      
      // Show success modal
      setModalTitle("Quiz Saved");
      setModalMessage("Your quiz has been saved successfully.");
      setShowSavedModal(true);
    } catch (error) {
      console.error("Failed to save quiz:", error);
      setModalTitle("Error");
      setModalMessage("Failed to save quiz. Please try again.");
      setShowSavedModal(true);
    }
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div
        className="d-flex align-items-center border-bottom mb-3"
        style={{ gap: "20px" }}
      >
        <button
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
          className={`btn btn-link p-0 ${
            !pathname.includes("Questions") ? "text-danger" : "text-secondary"
          }`}
          style={{
            fontSize: "1.2rem",
            fontWeight: "500",
            textDecoration: "none",
            borderRadius: 0,
            borderBottom: !pathname.includes("Questions")
              ? "3px solid #dc3545"
              : "none",
          }}
        >
          Details
        </button>

        <button
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`)
          }
          className={`btn btn-link p-0 ${
            pathname.includes("Questions") ? "text-danger" : "text-secondary"
          }`}
          style={{
            fontSize: "1.2rem",
            fontWeight: "500",
            textDecoration: "none",
            borderRadius: 0,
            borderBottom: pathname.includes("Questions")
              ? "3px solid #dc3545"
              : "none",
          }}
        >
          Questions
        </button>

        {/* Points Top-Right - Show quiz points from Details */}
        <div className="ms-auto fw-bold">
          Points&nbsp;{totalPoints} / {quizPoints > 0 ? quizPoints : 'Not Set'}
          {quizPoints > 0 && totalPoints !== quizPoints && (
            <span className="text-danger ms-2" style={{fontSize: '0.9rem', fontWeight: 'normal'}}>
              (Must equal {quizPoints})
            </span>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="text-center my-5">
        {questions.map((q, index) => (
          <QuestionItem
            key={q.questionId || index}
            question={q}
            index={index}
            isEditing={editingQuestionId === q.questionId}
            onEdit={
              isFacultyOrAdmin
                ? () => handleEditQuestion(q.questionId)
                : undefined
            }
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        ))}

        {isFacultyOrAdmin && (
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={handleAddQuestion}
            style={{
              padding: "14px 28px",
              fontSize: "1.1rem",
              borderRadius: "8px",
            }}
          >
            + New Question
          </Button>
        )}
      </div>

      <hr className="my-4" />

      {/* Bottom Buttons */}
      <div className="d-flex justify-content-end gap-2">
        <Button variant="light" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleSaveQuiz}>
          Save
        </Button>
      </div>

      {/* Saved/Error Modal */}
      <Modal show={showSavedModal} onHide={() => setShowSavedModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShowSavedModal(false);
            if (modalTitle === "Quiz Saved") {
              router.back();
            }
          }}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
