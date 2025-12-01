import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    assignments: [],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },
        addAssignment: (state, {payload: assignment}) => {
            // @ts-expect-error don't need the error
            state.assignments.push(assignment);
        },
        updateAssignment: (state, {payload: assignment}) => {
            // @ts-expect-error don't need the error
            state.assignments = state.assignments.map(a =>
                // @ts-expect-error don't need the error
                a._id === assignment._id ? assignment : a
            );
        },
        deleteAssignment: (state, {payload: assignmentId}) => {
            // @ts-expect-error don't need the error
            state.assignments = state.assignments.filter(a => a._id !== assignmentId);
        }
    },
});

export const {addAssignment, updateAssignment, deleteAssignment, setAssignments} = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
