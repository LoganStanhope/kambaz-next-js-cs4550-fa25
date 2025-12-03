import { FaCheckCircle, FaCircle } from "react-icons/fa";

type GreenCheckmarkProps = {
    enabled?: boolean; // optional, defaults to true
};

export default function GreenCheckmark({ enabled = true }: GreenCheckmarkProps) {
    // Determine styles based on enabled
    const checkStyle = {
        top: "2px",
        color: enabled ? "green" : "green",
        opacity: enabled ? 1 : 0.4,
        cursor: enabled ? "pointer" : "not-allowed",
    };

    const circleStyle = {
        color: enabled ? "white" : "#f0f0f0",
        opacity: enabled ? 1 : 0.3,
    };

    return (
        <span className="me-1 position-relative">
            <FaCheckCircle style={checkStyle} className="me-1 position-absolute fs-5" />
            <FaCircle style={circleStyle} className="me-1 fs-6" />
        </span>
    );
}
