import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";

interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    description: string;
    src?: string;
}

interface Enrollment {
    user: string;
    course: string;
}

interface CoursesState {
    courses: Course[];
    enrollments: Enrollment[];
}

const persistedEnrollments = typeof window !== "undefined" ? localStorage.getItem("enrollments") : null;

const initialState: CoursesState = {
    courses: courses,
    enrollments: persistedEnrollments ? JSON.parse(persistedEnrollments) : [],
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addNewCourse: (state, { payload: course }: PayloadAction<Course>) => {
            const newCourse = { ...course, _id: uuidv4() };
            state.courses.push(newCourse);
        },
        deleteCourse: (state, { payload: courseId }: PayloadAction<string>) => {
            state.courses = state.courses.filter((c) => c._id !== courseId);
            // Remove enrollments for deleted course
            state.enrollments = state.enrollments.filter((e) => e.course !== courseId);
            localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
        },
        updateCourse: (state, { payload: course }: PayloadAction<Course>) => {
            state.courses = state.courses.map((c) => (c._id === course._id ? course : c));
        },
        enrollCourse: (state, { payload }: PayloadAction<Enrollment>) => {
            const exists = state.enrollments.some(
                (e) => e.user === payload.user && e.course === payload.course
            );
            if (!exists) {
                state.enrollments.push(payload);
                localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
            }
        },
        unenrollCourse: (state, { payload }: PayloadAction<Enrollment>) => {
            state.enrollments = state.enrollments.filter(
                (e) => !(e.user === payload.user && e.course === payload.course)
            );
            localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
        },
    },
});

export const {
    addNewCourse,
    deleteCourse,
    updateCourse,
    enrollCourse,
    unenrollCourse,
} = coursesSlice.actions;

export default coursesSlice.reducer;
