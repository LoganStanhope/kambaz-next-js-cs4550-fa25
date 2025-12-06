"use client";

import React from "react";
import { Button } from "react-bootstrap";
import QuestionEditorFields from "./QuestionEditorFields";
import MCQEditor from "./MCQEditor";
import TFQEditor from "./TFQEditor";
import FIBQEditor from "./FIBQEditor";

interface QuestionEditorProps {
  question: any;
  index: number;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export default function QuestionEditor({
  question,
  index,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = React.useState(question);

  React.useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleUpdate = (updates: any) => {
    let newQuestion = { ...editedQuestion, ...updates };

    if (updates.type && updates.type !== editedQuestion.type) {
      if (updates.type === "MCQ") {
        newQuestion = {
          ...newQuestion,
          choices: newQuestion.choices || [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
          correctAnswer: undefined,
        };
      } else if (updates.type === "TFQ") {
        newQuestion = {
          ...newQuestion,
          correctAnswer: newQuestion.correctAnswer || "True",
          choices: undefined,
        };
      } else if (updates.type === "FIBQ") {
        newQuestion = {
          ...newQuestion,
          correctAnswer: newQuestion.correctAnswer || "",
          choices: undefined,
        };
      }
    }

    setEditedQuestion(newQuestion);
  };

  const handleSave = () => {
    onSave(editedQuestion);
  };

  const isMcq = editedQuestion.type === "MCQ";
  const isTfq = editedQuestion.type === "TFQ";
  const isFibq = editedQuestion.type === "FIBQ";

  return (
    <div className="mb-4 border border-gray-300 rounded bg-white">
      <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom border-gray-200 bg-gray-50">
        <h5 className="font-semibold text-gray-900 mb-0">
          Edit Question {index + 1}
        </h5>
      </div>

      <div className="px-4 py-3">
        <QuestionEditorFields
          question={editedQuestion}
          onUpdate={handleUpdate}
        />

        {isMcq && (
          <MCQEditor question={editedQuestion} onUpdate={handleUpdate} />
        )}
        {isTfq && (
          <TFQEditor question={editedQuestion} onUpdate={handleUpdate} />
        )}
        {isFibq && (
          <FIBQEditor question={editedQuestion} onUpdate={handleUpdate} />
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
