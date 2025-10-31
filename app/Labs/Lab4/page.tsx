"use client"
import PassingFunctions from "./PassingFunctions";
import ClickEvent from "@/app/Labs/Lab4/ClickEvent";
import PassingDataOnEvent from "@/app/Labs/Lab4/PassingDataOnEvent";
import EventObject from "@/app/Labs/Lab4/EventObject";
import Counter from "@/app/Labs/Lab4/Counter";
import BooleanStateVariables from "@/app/Labs/Lab4/BooleanStateVariables";
import StringStateVariables from "@/app/Labs/Lab4/StringStateVariables";
import DateStateVariable from "@/app/Labs/Lab4/DateStateVariable";
import ObjectStateVariable from "@/app/Labs/Lab4/ObjectStateVariable";
import ArrayStateVariable from "@/app/Labs/Lab4/ArrayStateVariable";
import ParentStateComponent from "@/app/Labs/Lab4/ParentStateComponent";
import ReduxExamples from "@/app/Labs/Lab4/ReduxExamples/page";
import store from "./store";
import {Provider} from "react-redux";

export default function Lab4() {
    function sayHello() {
        alert("Hello");
    }

    return (
            <div id="wd-lab4">
                <h2>Lab 4</h2>
                <p> Logan Stanhope CS4550.11597.202610 </p>
                <ClickEvent/>
                <PassingDataOnEvent/>
                <PassingFunctions theFunction={sayHello}/>
                <EventObject/>
                <Counter/>
                <BooleanStateVariables/>
                <StringStateVariables/>
                <DateStateVariable/>
                <ObjectStateVariable/>
                <ArrayStateVariable/>
                <ParentStateComponent/>
                <ReduxExamples/>
            </div>

    )
}