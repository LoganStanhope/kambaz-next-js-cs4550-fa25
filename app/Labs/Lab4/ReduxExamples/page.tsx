import HelloRedux from "@/app/Labs/Lab4/ReduxExamples/HelloRedux";
import CounterRedux from "@/app/Labs/Lab4/ReduxExamples/CounterRedux";
import AddRedux from "@/app/Labs/Lab4/ReduxExamples/AddRedux";
import TodoList from "@/app/Labs/Lab4/ReduxExamples/todos/TodoList";

export default function ReduxExamples() {
    return (
        <div>
            <h2>Redux Examples</h2>
            <HelloRedux/>
            <CounterRedux/>
            <AddRedux/>
            <TodoList/>
        </div>
    );
};