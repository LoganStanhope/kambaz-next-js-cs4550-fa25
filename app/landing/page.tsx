'use client';
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Kambaz Project</h1>
            <p>Web Development Course Project</p>

            <h2>Team Members</h2>
            <p>Sebastian Feliciano — CRN:11597 CS4550-01</p>
            <p>Logan Stanhope — CRN:11597 CS4550-01</p>
            <p>Nancy Farias — CRN:11597 CS4550-01</p>
            <p>Matthew Montoya-Figueroa — CRN:11597 CS4550-01</p>

            <h2>GitHub Repositories</h2>
            <p>
                Frontend Repository:{" "}
                <a
                    href="https://github.com/LoganStanhope/kambaz-next-js-cs4550-fa25/tree/final-project"
                    target="_blank"
                >
                    https://github.com/LoganStanhope/kambaz-next-js-cs4550-fa25/tree/final-project
                </a>
            </p>

            <p>
                Backend Repository:{" "}
                <a
                    href="https://github.com/LoganStanhope/kambaz-node-server-app/tree/final-project"
                    target="_blank"
                >
                    https://github.com/LoganStanhope/kambaz-node-server-app/tree/final-project
                </a>
            </p>

            <p>
                <Link href="/">Go to Application</Link>
            </p>
        </div>
    );
}
