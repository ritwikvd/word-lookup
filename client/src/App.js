import React from "react";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import SearchProvider from "./components/context/SearchProvider";

import "./App.scss";

const App = () => {
	return (
		<div className="container">
			<h1>Word Lookup</h1>
			<SearchProvider>
				<Search />
				<SearchResults />
			</SearchProvider>
		</div>
	);
};

export default App;
