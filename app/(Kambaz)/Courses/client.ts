import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/dashboard`;

export const fetchEnrollments = (userId) =>
    axiosWithCredentials.get(`${USERS_API}/${userId}/courses`).then(res => res.data);

export const enroll = (userId, courseId) =>
    axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`).then(res => res.data);

export const unenroll = (userId, courseId) =>
    axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`).then(res => res.data);

export const fetchAllCourses = async () => {
    const {data} = await axiosWithCredentials.get(COURSES_API);
    return data;
};
export const findMyCourses = async () => {
    const {data} = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
    return data;
};
export const findCoursesCreatedByUser = async (userId: string = "current") => {
    const {data} = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses/created`);
    return data;
};
export const createCourse = async (course: any) => {
    const {data} = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
};
export const deleteCourse = async (id: string) => {
    const {data} = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
    return data;
};
export const updateCourse = async (course: any) => {
    const {data} = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
    return data;
};
export const findModulesForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
    const response = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/modules`,
        module
    );
    return response.data;
};
export const deleteModule = async (courseId: string, moduleId: string) => {
    const response = await axios.delete(
        `${COURSES_API}/${courseId}/modules/${moduleId}`
    );
    return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
    const {data} = await axios.put(
        `${COURSES_API}/${courseId}/modules/${module._id}`,
        module
    );
    return data;
};
export const enrollIntoCourse = async (userId: string, courseId: string) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
};
export const findUsersForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
};
export async function fetchQuizzes(courseId: string | Array<string> | undefined) {
    const res = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
    return res.data;
}

export async function fetchQuiz(courseId: string | Array<string> | undefined, quizId: string | Array<string> | undefined) {
    const res = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes/${quizId}`);
    return res.data;
}

export async function saveQuiz(courseId: string | Array<string> | undefined, quizId: string | Array<string> | undefined, data: any) {
    if (quizId) {
        const response = await axios.put(`${COURSES_API}/${courseId}/quizzes/${quizId}`, data);
        return response.data;
    } else {
        const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, data);
        return response.data;
    }
}

export async function deleteQuiz(courseId: string | Array<string> | undefined, quizId: string | string[]) {
    const response = await axiosWithCredentials.delete(`${COURSES_API}/${courseId}/quizzes/${quizId}`);
    return response.data;
}






