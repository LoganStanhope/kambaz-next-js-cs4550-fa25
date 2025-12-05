import { createSlice } from "@reduxjs/toolkit";
import quizzes from "../../../Database/quizzes.json";

const quizSlice = createSlice({
    name: "quizzes",
    initialState: quizzes,
    reducers: {
        updateQuiz: (state, action) => {
            const index = state.findIndex(q => q._id === action.payload._id);
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload };
            }
        }
    }
});

export const { updateQuiz } = quizSlice.actions;
export default quizSlice.reducer;
