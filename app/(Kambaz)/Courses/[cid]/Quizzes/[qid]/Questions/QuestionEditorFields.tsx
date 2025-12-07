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

      {/* Question */}
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Question
        </FormLabel>
        <Col sm={9}>
          <FormControl
            as="textarea"
            rows={6}
            value={question.questionHtml || ""}
            onChange={(e) => onUpdate({ questionHtml: e.target.value })}
            placeholder="Enter your question"
          />
          <small className="text-muted d-block mt-1">
            You can use basic HTML tags for formatting (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;p&gt;paragraph&lt;/p&gt;, &lt;br&gt;line break)
          </small>
        </Col>
      </FormGroup>
    </div>
  );
}
