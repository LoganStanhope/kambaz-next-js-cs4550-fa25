"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import * as client from "../client";
import PeopleTable from "@/app/(Kambaz)/Courses/[cid]/People/Table";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [role, setRole] = useState("");
    const [searchName, setSearchName] = useState("");

    const { uid } = useParams();

    // Fetch all users from API
    const fetchUsers = async () => {
        const allUsers = await client.findAllUsers();
        setUsers(allUsers);
        applyFilters(allUsers, role, searchName);
    };

    // Create a new user and refresh the filtered list
    const createUser = async () => {
        const user = await client.createUser({
            firstName: "New",
            lastName: `User${users.length + 1}`,
            username: `newuser${Date.now()}`,
            password: "password123",
            email: `email${users.length + 1}@neu.edu`,
            section: "S101",
            role: "STUDENT",
        });
        const updatedUsers = [...users, user];
        setUsers(updatedUsers);
        applyFilters(updatedUsers, role, searchName);
    };

    // Apply role + name filters to a user list
    const applyFilters = (userList: any[], roleFilter: string, nameFilter: string) => {
        let filtered = [...userList];

        if (roleFilter) {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        if (nameFilter) {
            const regex = new RegExp(nameFilter, "i");
            filtered = filtered.filter(u => regex.test(u.firstName) || regex.test(u.lastName));
        }

        setFilteredUsers(filtered);
    };

    // Handlers
    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        applyFilters(users, newRole, searchName);
    };

    const handleNameChange = (newName: string) => {
        setSearchName(newName);
        applyFilters(users, role, newName);
    };

    useEffect(() => {
        fetchUsers();
    }, [uid]);

    return (
        <div>
            {/* Create User button */}
            <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
                <FaPlus className="me-2" />
                Add User
            </button>

            <h3>Users</h3>

            {/* Name filter */}
            <FormControl
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Search people"
                className="float-start w-25 me-2 wd-filter-by-name"
            />

            {/* Role filter */}
            <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="form-select float-start w-25 wd-select-role"
            >
                <option value="">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="TA">Assistants</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrators</option>
            </select>

            <div style={{ clear: "both", marginTop: "1rem" }}></div>

            {/* Users table */}
            <PeopleTable users={filteredUsers} fetchUsers={fetchUsers} />
        </div>
    );
}
