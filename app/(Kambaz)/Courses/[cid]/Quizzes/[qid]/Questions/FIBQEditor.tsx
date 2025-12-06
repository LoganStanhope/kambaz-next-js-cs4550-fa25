"use client";

import { FormGroup, FormLabel, FormControl, Row, Col } from "react-bootstrap";

interface FIBQEditorProps {
  question: any;
  onUpdate: (updates: any) => void;
}

export default function FIBQEditor({ question, onUpdate }: FIBQEditorProps) {
  return (
    <div className="mt-3">
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Correct Answer
        </FormLabel>
        <Col sm={9}>
          <FormControl
            type="text"
            value={question.correctAnswer || ""}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Enter the correct answer"
          />
        </Col>
      </FormGroup>
    </div>
  );
}
