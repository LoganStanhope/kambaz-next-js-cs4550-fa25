"use client";

import { FormGroup, FormLabel, FormSelect, Row, Col } from "react-bootstrap";

interface TFQEditorProps {
  question: any;
  onUpdate: (updates: any) => void;
}

export default function TFQEditor({ question, onUpdate }: TFQEditorProps) {
  return (
    <div className="mt-3">
      <FormGroup as={Row}>
        <FormLabel column sm={3}>
          Correct Answer
        </FormLabel>
        <Col sm={9}>
          <FormSelect
            value={question.correctAnswer || "True"}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          >
            <option value="True">True</option>
            <option value="False">False</option>
          </FormSelect>
        </Col>
      </FormGroup>
    </div>
  );
}
