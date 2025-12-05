import {FaCheckCircle, FaCircle} from "react-icons/fa";
import {CgUnavailable} from "react-icons/cg";
import {Button} from "react-bootstrap";
import React, {useState} from "react";

interface GreenCheckmarkProps {
    enable?: boolean;
}

export default function GreenCheckmark({enable}: GreenCheckmarkProps) {
    const [isEnabled, setIsEnabled] = useState(enable === undefined || enable);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEnabled(!isEnabled);
    };

    if (enable === undefined || enable || isEnabled) {
        return (
            <span className="me-1 position-relative">
      <FaCheckCircle style={{top: "2px"}} className="text-success me-1 position-absolute fs-5"/>
      <FaCircle className="text-white me-1 fs-6"/>
    </span>
        );
    } else {
        return (
            <Button
                style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                }}
                onClick={(e) => {
                    toggle(e);
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <CgUnavailable className="fs-2 text-danger" />
            </Button>
        );
    }
}


