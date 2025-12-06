"use client";

import {
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  Row,
  Col,
} from "react-bootstrap";

interface QuestionEditorFieldsProps {
  question: any;
  onUpdate: (updates: any) => void;
}

export default function QuestionEditorFields({
  question,
  onUpdate,
}: QuestionEditorFieldsProps) {
  return (
    <div>
      {/* Question Type */}
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Question Type
        </FormLabel>
        <Col sm={9}>
          <FormSelect
            value={question.type || "MCQ"}
            onChange={(e) => onUpdate({ type: e.target.value })}
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="TFQ">True/False</option>
            <option value="FIBQ">Fill in the Blank</option>
          </FormSelect>
        </Col>
      </FormGroup>

      {/* Title */}
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Question Title
        </FormLabel>
        <Col sm={9}>
          <FormControl
            type="text"
            value={question.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter question title"
          />
        </Col>
      </FormGroup>

      {/* Points */}
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Points
        </FormLabel>
        <Col sm={9}>
          <FormControl
            type="number"
            value={question.points || 0}
            onChange={(e) =>
              onUpdate({ points: parseInt(e.target.value) || 0 })
            }
            min="0"
          />
        </Col>
      </FormGroup>

      {/* Description */}
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Question Description
        </FormLabel>
        <Col sm={9}>
          <FormControl
            as="textarea"
            rows={4}
            value={question.questionHtml || ""}
            onChange={(e) => onUpdate({ questionHtml: e.target.value })}
            placeholder="Enter question description"
          />
        </Col>
      </FormGroup>
    </div>
  );
}
