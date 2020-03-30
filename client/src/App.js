import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SearchProvider from "./components/context/SearchProvider";

const App = () => {
    return (
        <SearchProvider>
            <Router>
                <Route exact path = "/" component = {Search} />
                <Route exact path = "/" component = {SearchResults} />
            </Router>
        </SearchProvider>
    )
}

export default App;
