import todos from "./todos.json";
import {ListGroup} from "react-bootstrap";
import TodoItem from "@/app/Labs/Lab3/TodoItem";

export default function TodoList() {
    return (
        <>
            <h3>Todo List</h3>
            <ListGroup>
                {todos.map(todo => {
                    return (<TodoItem todo={todo}/>);
                })}
            </ListGroup>
            <hr/>
        </>
    );
}
