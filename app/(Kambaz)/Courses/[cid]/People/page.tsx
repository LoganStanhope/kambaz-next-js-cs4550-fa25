'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table";
import { findUsersForCourse } from "../../client";

export default function People() {
    const { cid } = useParams(); // current course id
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        if (!cid) return;
        setLoading(true);
        try {
            // @ts-expect-error don't need the error
            const data = await findUsersForCourse(cid);
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]);

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            <h2>People in this course</h2>
            <PeopleTable users={users} fetchUsers={fetchUsers} />
        </div>
    );
}

