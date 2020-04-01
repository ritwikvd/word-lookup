import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SearchProvider from "./components/context/SearchProvider";

import "./App.scss";

const App = () => {
    return (
        <div className = "container">
            <h1>Word Lookup</h1>
            <SearchProvider>
                <Router>
                    <Route exact path = "/" component = {Search} />
                    <Route exact path = "/" component = {SearchResults} />
                </Router>
            </SearchProvider>
        </div>
    )
}

export default App;
