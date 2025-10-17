'use client';
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function TOC() {
    const pathname = usePathname();

    return (
        <Nav variant="pills" className="d-flex flex-row justify-content-center">
            <Nav.Item>
                <Nav.Link as={Link} href="/Labs" id="wd-a1"> Labs </Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link as={Link} href="/Labs/Lab1" id="wd-a2" active={pathname.includes("Labs/Lab1")}> Lab
                    1 </Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link as={Link} href="/Labs/Lab2" id="wd-a3" active={pathname.includes("Labs/Lab2")}> Lab
                    2 </Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link as={Link} href="/Labs/Lab3" id="wd-a4" active={pathname.includes("Labs/Lab3")}> Lab
                    3 </Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link as={Link} href="/" id="wd-a3">Kambaz</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="https://github.com/LoganStanhope" target="_blank" rel="noopener noreferrer">
                    My GitHub
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
