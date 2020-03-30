import React, { useReducer } from 'react';
import SearchContext from "./searchContext";
import searchReducer from "./searchReducer";

const SearchProvider = ({ children }) => {

    const initialState = {
        searchedWord: null,
        searchResults: {
            word: null,
            derivatives: null,
            etymologies: null,
            lexicalCategory: null,
            phoneticSpelling: null,
            senses: null
        },
        alerts: []
    }

    const [state, dispatch] = useReducer(searchReducer, initialState);

    const addAlert = alert => {
        dispatch({
            type: `ADD_ALERT`,
            payload: {
                alert
            }
        });
    }

    const searchWord = async searchedWord => {
        const response = await fetch(`/api/v1/words/${searchedWord}`);

        const result = await response.json();

        if (!result.success) return addAlert("Word not found");

        const { derivatives, etymologies, lexicalCategory, phoneticSpelling, senses } = result.data[0];

        const searchResults = {
            derivatives,
            etymologies,
            lexicalCategory,
            phoneticSpelling,
            senses
        };

        dispatch({
            type: `SEARCH_WORD`,
            payload: {
                searchedWord,
                searchResults
            }
        });
    };

    return (
        <SearchContext.Provider value={{
            searchWord,
            state
        }}>
            {children}
        </SearchContext.Provider>
    )
};

export default SearchProvider;
