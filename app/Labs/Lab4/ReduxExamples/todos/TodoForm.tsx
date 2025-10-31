import {Button, FormControl, ListGroupItem} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {addTodo, updateTodo, setTodo} from "./todosReducer";

export default function TodoForm() {
    const {todo} = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    return (
        <ListGroupItem>
            <Button onClick={() => dispatch(addTodo(todo))} variant="success"
                    id="wd-add-todo-click"> Add </Button>
            <Button onClick={() => dispatch(updateTodo(todo))} variant="warning"
                    id="wd-update-todo-click"> Update </Button>
            <FormControl value={todo.title}
                         onChange={(e) => dispatch(setTodo({...todo, title: e.target.value}))}/>
        </ListGroupItem>
    );
}

