import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/courses`;

export const fetchAllAssignments = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${courseId}/assignments`);
    return data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const { data } = await axiosWithCredentials.post(`${ASSIGNMENTS_API}/${courseId}/assignments/editor`, assignment);
    return data;
};

export const deleteAssignment = async (assignmentId: string, courseId: string) => {
    const { data } = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${courseId}/assignments/${assignmentId}`);
    return data;
};

export const updateAssignment = async (assignment: any) => {
    const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment.course}/assignments/${assignment._id}`, assignment);
    return data;
};