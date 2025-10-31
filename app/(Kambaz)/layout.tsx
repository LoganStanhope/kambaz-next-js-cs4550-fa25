"use client";
import {ReactNode} from "react";
import KambazNavigation from "./Navigation";
import store from "./store";
import {Provider} from "react-redux";
import "./styles.css";

export default function KambazLayout({children}:
                                         Readonly<{ children: ReactNode }>) {
    return (
        <Provider store={store}>
            <div className="d-flex" id="wd-kambaz">
                <div>
                    <KambazNavigation/>
                </div>
                <div className="wd-main-content-offset p-3 flex-fill">{children}</div>
            </div>
        </Provider>
    );
};
