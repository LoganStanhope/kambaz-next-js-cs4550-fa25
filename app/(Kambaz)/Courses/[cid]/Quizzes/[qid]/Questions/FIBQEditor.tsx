"use client";

import {
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

interface FIBQEditorProps {
  question: any;
  onUpdate: (updates: any) => void;
}

export default function FIBQEditor({ question, onUpdate }: FIBQEditorProps) {
  const getBlanks = () => {
    if (!question.correctAnswer) {
      return [{ blankId: uuidv4(), possibleAnswers: [""] }];
    }
    if (typeof question.correctAnswer === "string") {
      return [{ blankId: uuidv4(), possibleAnswers: [question.correctAnswer] }];
    }
    if (Array.isArray(question.correctAnswer)) {
      if (question.correctAnswer.length === 0) {
        return [{ blankId: uuidv4(), possibleAnswers: [""] }];
      }
      if (typeof question.correctAnswer[0] === "string") {
        return [{ blankId: uuidv4(), possibleAnswers: question.correctAnswer }];
      }
      return question.correctAnswer;
    }
    return [{ blankId: uuidv4(), possibleAnswers: [""] }];
  };

  const blanks = getBlanks();

  const handleAddBlank = () => {
    const updatedBlanks = [
      ...blanks,
      { blankId: uuidv4(), possibleAnswers: [""] },
    ];
    onUpdate({ correctAnswer: updatedBlanks });
  };

  const handleRemoveBlank = (blankIndex: number) => {
    if (blanks.length > 1) {
      const updatedBlanks = blanks.filter((_, i) => i !== blankIndex);
      onUpdate({ correctAnswer: updatedBlanks });
    }
  };

  const handleAddAnswer = (blankIndex: number) => {
    const updatedBlanks = [...blanks];
    updatedBlanks[blankIndex].possibleAnswers.push("");
    onUpdate({ correctAnswer: updatedBlanks });
  };

  const handleRemoveAnswer = (blankIndex: number, answerIndex: number) => {
    const updatedBlanks = [...blanks];
    if (updatedBlanks[blankIndex].possibleAnswers.length > 1) {
      updatedBlanks[blankIndex].possibleAnswers = updatedBlanks[
        blankIndex
      ].possibleAnswers.filter((_, i) => i !== answerIndex);
      onUpdate({ correctAnswer: updatedBlanks });
    }
  };

  const handleAnswerChange = (
    blankIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const updatedBlanks = [...blanks];
    updatedBlanks[blankIndex].possibleAnswers[answerIndex] = value;
    onUpdate({ correctAnswer: updatedBlanks });
  };

  return (
    <div className="mt-3">
      <FormLabel className="fw-semibold">Fill in the Blank Answers</FormLabel>
      <small className="text-muted d-block mb-2">
        Add multiple blanks, each with multiple possible correct answers (case-insensitive)
      </small>
      <div>
        {blanks.map((blank, blankIndex) => (
          <div
            key={blank.blankId || blankIndex}
            className="border rounded p-3 mb-3"
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <FormLabel className="mb-0 fw-semibold">
                Blank {blankIndex + 1}
              </FormLabel>
              {blanks.length > 1 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveBlank(blankIndex)}
                >
                  <FaTrash className="me-1" />
                  Remove Blank
                </Button>
              )}
            </div>
            <div>
              {blank.possibleAnswers.map((answer, answerIndex) => (
                <div
                  key={answerIndex}
                  className="d-flex align-items-center gap-2 mb-2"
                >
                  <FormControl
                    type="text"
                    value={answer}
                    onChange={(e) =>
                      handleAnswerChange(blankIndex, answerIndex, e.target.value)
                    }
                    placeholder={`Possible answer ${answerIndex + 1}`}
                    className="flex-fill"
                  />
                  {blank.possibleAnswers.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveAnswer(blankIndex, answerIndex)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleAddAnswer(blankIndex)}
                className="mt-1"
              >
                <FaPlus className="me-1" />
                Add Answer
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleAddBlank}
          className="mt-2"
        >
          <FaPlus className="me-1" />
          Add Another Blank
        </Button>
      </div>
    </div>
  );
}
