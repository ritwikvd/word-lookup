import React, { useReducer, useEffect } from "react";
import SearchContext from "./searchContext";
import searchReducer from "./searchReducer";

const initialState = {
	words: [],
	prompts: [],
	searchResults: {},
	alert: "",
	loading: true,
};

const SearchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(searchReducer, initialState);

	const addAlert = alert => {
		dispatch({
			type: `ADD_ALERT`,
			payload: alert,
		});
	};

	const searchWord = searchedWord => {
		const results = state.words.find(word => word.word.startsWith(searchedWord));

		const { word, derivatives, etymologies, lexicalCategory, phoneticSpelling, senses } = results;

		const searchResults = {
			word,
			derivatives,
			etymologies,
			lexicalCategory,
			phoneticSpelling,
			senses,
		};

		dispatch({
			type: `SEARCH_WORD`,
			payload: searchResults,
		});
	};

	const addWord = async word => {
		const resp = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words/${word.replace(" ", "_")}`, {
			method: "POST",
		});

		const result = await resp.json();

		const { success } = result;

		addAlert(success ? "Word added successfully" : "No such word exists");
	};

	const clearSearch = () => {
		dispatch({
			type: `CLEAR_SEARCH`,
		});
	};

	const removeAndAlert = (alert, word) => {
		dispatch({
			type: `REMOVE_WORD`,
			payload: {
				word,
				alert,
			},
		});
	};

	const deleteWord = async word => {
		const response = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words/${word}`, {
			method: "DELETE",
		});

		const { success } = await response.json();

		removeAndAlert(success ? "Word deleted successfully" : "Could not delete word", word);
	};

	const promptWord = prompt => {
		dispatch({
			type: `ADD_PROMPTS`,
			payload: prompt,
		});
	};

	useEffect(() => {
		const callApi = async () => {
			const response = await fetch(`${process.env.REACT_APP_PROXY}/api/v1/words`);

			let { data } = await response.json();

			dispatch({
				type: `ADD_WORDS`,
				payload: data,
			});
		};

		callApi();
	}, [state.words]);

	return (
		<SearchContext.Provider
			value={{
				searchWord,
				addWord,
				clearSearch,
				deleteWord,
				promptWord,
				state,
			}}>
			{children}
		</SearchContext.Provider>
	);
};

export default SearchProvider;
