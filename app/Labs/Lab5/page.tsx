import EnvironmentVariables from "./EnvironmentVariables";
import PathParameters from "@/app/Labs/Lab5/PathParameters";
import QueryParameters from "@/app/Labs/Lab5/QueryParameters";
import WorkingWithObjects from "@/app/Labs/Lab5/WorkingWithObjects";
import WorkingWithArrays from "@/app/Labs/Lab5/WorkingWithArrays";
import HttpClient from "@/app/Labs/Lab5/HttpClient";
import WorkingWithObjectsAsynchronously from "@/app/Labs/Lab5/WorkingWithObjectsAsynchronously";
import WorkingWithArraysAsynchronously from "@/app/Labs/Lab5/WorkingWithArraysAsynchronously";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function Lab5() {
    return (
        <div id="wd-lab5">
            <h2>Lab 5</h2>
            <div className="list-group">
                <a href={`${HTTP_SERVER}/lab5/welcome`}
                   className="list-group-item">
                    Welcome
                </a>
            </div>
            <hr/>
            <EnvironmentVariables/>
            <PathParameters/>
            <QueryParameters/>
            <WorkingWithObjects/>
            <WorkingWithArrays/>
            <HttpClient/>
            <WorkingWithObjectsAsynchronously/>
            <WorkingWithArraysAsynchronously/>
        </div>
    );
}