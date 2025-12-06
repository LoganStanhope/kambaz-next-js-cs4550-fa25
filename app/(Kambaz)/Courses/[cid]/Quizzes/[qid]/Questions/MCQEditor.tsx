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

interface MCQEditorProps {
  question: any;
  onUpdate: (updates: any) => void;
}

export default function MCQEditor({ question, onUpdate }: MCQEditorProps) {
  const choices = question.choices || [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];

  const handleChoiceChange = (index: number, field: string, value: any) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = {
      ...updatedChoices[index],
      [field]: value,
    };
    onUpdate({ choices: updatedChoices });
  };

  const handleAddChoice = () => {
    const updatedChoices = [...choices, { text: "", isCorrect: false }];
    onUpdate({ choices: updatedChoices });
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 2) {
      const updatedChoices = choices.filter((_, i) => i !== index);
      onUpdate({ choices: updatedChoices });
    }
  };

  const handleSetCorrect = (index: number) => {
    const updatedChoices = choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index,
    }));
    onUpdate({ choices: updatedChoices });
  };

  return (
    <div className="mt-3">
      <FormLabel className="fw-semibold">Multiple Choice Options</FormLabel>
      <div>
        {choices.map((choice, index) => (
          <div key={index} className="d-flex align-items-center gap-2 mb-2">
            <input
              type="radio"
              name={`correct-${question.questionId}`}
              checked={choice.isCorrect}
              onChange={() => handleSetCorrect(index)}
              className="form-check-input"
            />
            <FormControl
              type="text"
              value={choice.text}
              onChange={(e) =>
                handleChoiceChange(index, "text", e.target.value)
              }
              placeholder={`Option ${index + 1}`}
              className="flex-fill"
            />
            {choices.length > 2 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveChoice(index)}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleAddChoice}
          className="mt-2"
        >
          <FaPlus className="me-1" />
          Add Option
        </Button>
      </div>
    </div>
  );
}
