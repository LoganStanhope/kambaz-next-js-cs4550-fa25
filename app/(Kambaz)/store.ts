import {configureStore} from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer"

const store = configureStore({
    reducer: {
        coursesReducer,
        modulesReducer,
        accountReducer,
        assignmentsReducer
    },

});
export default store;