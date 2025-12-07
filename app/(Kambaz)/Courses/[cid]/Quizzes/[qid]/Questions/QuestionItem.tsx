"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { FaPencil } from "react-icons/fa6";
import QuestionEditor from "./QuestionEditor";

interface QuestionItemProps {
  question: any;
  index: number;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (question: any) => void;
  onCancel?: () => void;
}

export default function QuestionItem({
  question,
  index,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
}: QuestionItemProps) {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  ) as any;
  const isFacultyOrAdmin =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const { type } = question;
  const isMcq = question.type === "MCQ";
  const isTfq = question.type === "TFQ";
  const isFibq = question.type === "FIBQ";

  if (isEditing && onSave && onCancel) {
    return (
      <QuestionEditor
        question={question}
        index={index}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="mb-4 border border-gray-300 rounded bg-white">
      <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom border-gray-200 bg-gray-50">
        <div className="d-flex align-items-baseline gap-2">
          <h5 className="font-semibold text-gray-900 mb-0">
            Question {index + 1}: {question.title}
          </h5>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-sm text-gray-700">{question.points} pts</span>
          {isFacultyOrAdmin && onEdit && (
            <button
              onClick={onEdit}
              className="btn btn-sm btn-link p-0 text-secondary"
              title="Edit question"
            >
              <FaPencil />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 text-sm text-gray-800">
        <div
          dangerouslySetInnerHTML={{
            __html: question.questionHtml || "<p><em>No content yet</em></p>",
          }}
        />

        {/* MCQ options */}
        {isMcq && question.choices && (
          <div className="mt-4">
            {question.choices.map((choice, i) => (
              <div key={i} className="d-flex align-items-start gap-2 mb-2">
                <span
                  className="mt-1 d-inline-block"
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "1px solid #9ca3af",
                    borderRadius: "50%",
                  }}
                />
                <span>
                  {choice.text}{" "}
                  {isFacultyOrAdmin && choice.isCorrect && (
                    <span className="ms-1 text-xs fw-semibold text-success">
                      (Correct answer)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* True/False question */}
        {isTfq && (
          <div className="mt-4">
            {["True", "False"].map((value) => {
              const isCorrect =
                question.correctAnswer &&
                question.correctAnswer.toLowerCase() === value.toLowerCase();
              return (
                <div
                  key={value}
                  className="d-flex align-items-start gap-2 mb-2"
                >
                  <span
                    className="mt-1 d-inline-block"
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "1px solid #9ca3af",
                      borderRadius: "50%",
                    }}
                  />
                  <span>
                    {value}{" "}
                    {isFacultyOrAdmin && isCorrect && (
                      <span className="ms-1 text-xs fw-semibold text-success">
                        (Correct answer)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Fill in the blank */}
        {isFibq && (
          <div className="mt-4">
            {isFacultyOrAdmin && question.correctAnswer && (
              <div>
                {Array.isArray(question.correctAnswer) &&
                question.correctAnswer.length > 0 &&
                typeof question.correctAnswer[0] === "object" ? (
                  question.correctAnswer.map((blank: any, blankIndex: number) => (
                    <div key={blank.blankId || blankIndex} className="mb-3">
                      <span className="text-gray-700 fw-semibold">
                        Blank {blankIndex + 1} - Possible answers:
                      </span>
                      <div className="mt-1">
                        {blank.possibleAnswers && blank.possibleAnswers.length > 0 ? (
                          blank.possibleAnswers.map((answer: string, i: number) => (
                            <span key={i} className="badge bg-success me-1 mb-1">
                              {answer || "(empty)"}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">Not set</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mb-2">
                    <span className="text-gray-700 me-2">Correct answer:</span>
                    {Array.isArray(question.correctAnswer) ? (
                      <div className="mt-1">
                        {question.correctAnswer.map((answer: string, i: number) => (
                          <span key={i} className="badge bg-success me-1">
                            {answer}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="fw-semibold text-success">
                        {question.correctAnswer || "Not set"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
