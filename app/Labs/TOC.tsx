'use client';
import Nav from "react-bootstrap/Nav";
import Link from "next/link";

export default function TOC() {
    return (
        <Nav variant="pills" className="d-flex flex-row justify-content-center">
            <Nav.Item>
                <Link href="/Labs" passHref legacyBehavior>
                    <Nav.Link>Labs</Nav.Link>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link href="/Labs/Lab1" passHref legacyBehavior>
                    <Nav.Link>Lab 1</Nav.Link>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link href="/Labs/Lab2" passHref legacyBehavior>
                    <Nav.Link>Lab 2</Nav.Link>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link href="/Labs/Lab3" passHref legacyBehavior>
                    <Nav.Link>Lab 3</Nav.Link>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link href="/" passHref legacyBehavior>
                    <Nav.Link>Kambaz</Nav.Link>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="https://github.com/LoganStanhope" target="_blank" rel="noopener noreferrer">
                    My GitHub
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
