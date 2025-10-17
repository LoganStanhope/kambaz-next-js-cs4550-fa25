import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "@/app/Labs/Lab3/VariableTypes";
import BooleanVariables from "@/app/Labs/Lab3/BooleanVariables";
import IfElse from "@/app/Labs/Lab3/IfElse";
import TernaryOperator from "@/app/Labs/Lab3/TernaryOperator";
import ConditionalOutputIfElse from "@/app/Labs/Lab3/ConditionalOutputIfElse";
import ConditionalOutputInline from "@/app/Labs/Lab3/ConditionalOutputInline";
import LegacyFunctions from "@/app/Labs/Lab3/LegacyFunctions";
import ArrowFunctions from "@/app/Labs/Lab3/ArrowFunctions";
import ImpliedReturn from "@/app/Labs/Lab3/ImpliedReturn";
import TemplateLiterals from "@/app/Labs/Lab3/TemplateLiterals";
import SimpleArrays from "@/app/Labs/Lab3/SimpleArrays";
import ArrayIndexAndLength from "@/app/Labs/Lab3/ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "@/app/Labs/Lab3/AddingAndRemovingToFromArrays";
import ForLoops from "@/app/Labs/Lab3/ForLoops";
import MapFunction from "@/app/Labs/Lab3/MapFunction";
import FindFunction from "@/app/Labs/Lab3/FindFunction";
import FindIndex from "@/app/Labs/Lab3/FindIndex";
import FilterFunction from "@/app/Labs/Lab3/FilterFunction";
import JsonStringify from "@/app/Labs/Lab3/JsonStringify";
import House from "@/app/Labs/Lab3/House";
import TodoItem from "@/app/Labs/Lab3/TodoItem";
import TodoList from "@/app/Labs/Lab3/todos/TodoList";
import Spreading from "@/app/Labs/Lab3/Spreading";
import Destructing from "@/app/Labs/Lab3/Destructing";
import FunctionDestructing from "@/app/Labs/Lab3/FunctionDestructing";
import DestructingImports from "@/app/Labs/Lab3/DestructingImports";
import Classes from "@/app/Labs/Lab3/Classes";
import Styles from "@/app/Labs/Lab3/Styles";
import Add from "@/app/Labs/Lab3/Add";
import Square from "@/app/Labs/Lab3/Square";
import Highlight from "@/app/Labs/Lab3/Highlight";
import PathParameters from "@/app/Labs/Lab3/PathParameters";

export default function Lab3() {
    console.log('Hello World!');
    return (
        <div id="wd-lab3">
            <h3>Lab 3</h3><br/>
            <VariablesAndConstants/>
            <VariableTypes/>
            <BooleanVariables/>
            <IfElse/>
            <TernaryOperator/>
            <ConditionalOutputIfElse/>
            <ConditionalOutputInline/>
            <LegacyFunctions/>
            <ArrowFunctions/>
            <ImpliedReturn/>
            <TemplateLiterals/>
            <SimpleArrays/>
            <ArrayIndexAndLength/>
            <AddingAndRemovingToFromArrays/>
            <ForLoops/>
            <MapFunction/>
            <FindFunction/>
            <FindIndex/>
            <FilterFunction/>
            <JsonStringify/>
            <House/>
            <TodoItem/>
            <TodoList/>
            <Spreading/>
            <Destructing/>
            <FunctionDestructing/>
            <DestructingImports/>
            <Classes/>
            <Styles/>
            <Add a={3} b={4}/>
            <h4>Square of 4</h4>
            <Square>4</Square>
            <hr/>
            <Highlight>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipitratione eaque illo minus cum, saepe
                totam
                vel nihil repellat nemo explicabo excepturi consectetur. Modi omnis minus sequi maiores, provident
                voluptates.
            </Highlight>
            <PathParameters/>
        </div>
    );
}