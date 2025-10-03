import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
                </thead>
                <tbody>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Tony</span>{" "}
                    <span className="wd-last-name">Stark</span></td>
                    <td className="wd-login-id">001234561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-10-01</td>
                    <td className="wd-total-activity">10:21:32</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Bruce</span>{" "}
                    <span className="wd-last-name">Wayne</span></td>
                    <td className="wd-login-id">001298461S</td>
                    <td className="wd-section">S233</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">1982-5-27</td>
                    <td className="wd-total-activity">01:41:12</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Steve</span>{" "}
                    <span className="wd-last-name">Rogers</span></td>
                    <td className="wd-login-id">001988821S</td>
                    <td className="wd-section">S999</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2023-1-04</td>
                    <td className="wd-total-activity">51:00:54</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Natasha</span>{" "}
                    <span className="wd-last-name">Romanoff</span></td>
                    <td className="wd-login-id">0012989932</td>
                    <td className="wd-section">S873</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2025-5-01</td>
                    <td className="wd-total-activity">04:32:23</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Logan</span>{" "}
                    <span className="wd-last-name">Stanhope</span></td>
                    <td className="wd-login-id">002947318</td>
                    <td className="wd-section">S783</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2024-8-13</td>
                    <td className="wd-total-activity">09:45:02</td></tr>
                </tbody>
            </Table>
        </div> );}