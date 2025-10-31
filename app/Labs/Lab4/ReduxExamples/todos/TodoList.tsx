"use client";
import {ListGroup} from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import {useSelector} from "react-redux";

export default function TodoList() {
    const {todos} = useSelector((state: any) => state.todosReducer);
    return (
        <div>
            <h2>Todo List</h2>
            <ListGroup key={todos}>
                <TodoForm key={todos}/>
                {todos.map((todo: any) => (
                    <TodoItem key={todo} todo={todo}/>
                ))}
            </ListGroup>
            <hr/>
        </div>
    );
}