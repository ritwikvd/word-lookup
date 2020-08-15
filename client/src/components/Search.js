import React, { useContext, useState, useEffect } from "react";
import SearchContext from "./context/searchContext";

const Search = () => {
	const { searchWord, promptWord, addWord, state } = useContext(SearchContext);

	const { alert, prompts, searchResults } = state;

	const [value, setValue] = useState("");
	const [missing, setMissing] = useState(false);

	const inputRef = React.createRef();

	const updateValueAndPrompt = ({ target: { value } }) => {
		setValue(value);
		setMissing(false);
		promptWord(value);
	};

	const searchForWord = e => {
		e.preventDefault();

		if (!prompts.length && !value) return setMissing(true);

		if (!prompts.length) return;

		searchWord(value);
		setValue("");
	};

	useEffect(() => {
		setValue("");
	}, [searchResults]);

	useEffect(() => {
		!missing ? inputRef.current.focus() : inputRef.current.blur();
	});

	return (
		<>
			<div className={"alert-container"}>{alert}</div>

			<div className="search-container">
				<form action="#" className="search-form" onSubmit={searchForWord}>
					<input
						ref={inputRef}
						type="text"
						value={value}
						onChange={updateValueAndPrompt}
						onFocus={() => setMissing(false)}
						className={missing ? "search-box shake" : "search-box"}
						placeholder={missing ? "?" : "Search for a word"}
					/>

					{value && !prompts.length ? (
						<button className="btn-add-word" onClick={() => addWord(value)}>
							Add Word
						</button>
					) : null}
				</form>
			</div>
		</>
	);
};

export default Search;
