import React, { useReducer, useEffect } from "react";
import SearchContext from "./searchContext";
import searchReducer from "./searchReducer";

const initialState = {
	words: [],
	prompts: [],
	searchResults: {},
	alert: "",
	loading: true
};

const SearchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(searchReducer, initialState);

	const callApi = async () => {
		const response = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words`);

		let { data } = await response.json();

		console.log("This is the data ", data);

		dispatch({
			type: `ADD_WORDS`,
			payload: data
		});
	};

	const addAlert = alert => {
		dispatch({
			type: `ADD_ALERT`,
			payload: alert
		});
	};

	const searchWord = searchedWord => {
		const results = state.words.find(word => word.word.startsWith(searchedWord));

		const { word, extras, derivatives, etymologies, lexicalCategory, phoneticSpelling, senses } = results;

		const searchResults = {
			word,
			extras,
			derivatives,
			etymologies,
			lexicalCategory,
			phoneticSpelling,
			senses
		};

		dispatch({
			type: `SEARCH_WORD`,
			payload: searchResults
		});
	};

	const addWord = async word => {
		dispatch({
			type: "LOADING"
		});

		const resp = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words/${word.replace(" ", "_")}`, {
			method: "POST"
		});

		const result = await resp.json();

		const { success } = result;

		console.log("success", success);

		addAlert(success ? "Word added successfully" : "No such word exists");

		setTimeout(callApi, 2000);
	};

	const clearSearch = () => {
		dispatch({
			type: `CLEAR_SEARCH`
		});
	};

	const removeAndAlert = (alert, word) => {
		dispatch({
			type: `REMOVE_WORD`,
			payload: {
				word,
				alert
			}
		});
	};

	const deleteWord = async word => {
		const response = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words/${word}`, {
			method: "DELETE"
		});

		const { success } = await response.json();

		removeAndAlert(success ? "Word deleted successfully" : "Could not delete word", word);

		setTimeout(callApi, 2000);
	};

	const promptWord = prompt => {
		dispatch({
			type: `ADD_PROMPTS`,
			payload: prompt
		});
	};

	useEffect(() => {
		callApi();
	}, []);

	return (
		<SearchContext.Provider
			value={{
				searchWord,
				addWord,
				clearSearch,
				deleteWord,
				promptWord,
				state
			}}>
			{children}
		</SearchContext.Provider>
	);
};

export default SearchProvider;
