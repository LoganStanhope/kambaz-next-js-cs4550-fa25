"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  fetchQuestions,
  updateQuestion,
  createQuestion,
} from "../../../../../Courses/client";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
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
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as any;
  const isFacultyOrAdmin =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        if (cid && qid) {
          const data = await fetchQuestions(cid as string, qid as string);
          setQuestions(data);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cid && qid) {
      loadQuestions();
    }
  }, [cid, qid]);

  const totalPoints =
    questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;

  const handleAddQuestion = () => {
    const newQuestion = {
      questionId: uuidv4(),
      title: "New Question",
      type: "MCQ",
      points: 0,
      questionHtml: "",
      choices: [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ],
      correctAnswer: "Option 1",
    };

    setQuestions([...questions, newQuestion]);
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
    } catch (error) {
      console.error("Failed to save quiz:", error);
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

        {/* Points Top-Right */}
        <div className="ms-auto fw-bold">Points&nbsp;{totalPoints}</div>
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
    </div>
  );
}
