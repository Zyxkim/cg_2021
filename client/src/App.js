import React from "react";
import Generator from "./Generator";
import "./style.css"
import { Routes, Route } from 'react-router-dom'
import List from "./List";

export default function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Generator />}/>
                <Route path="/list" element={<List />} />
            </Routes>
        </div>
    );
}
