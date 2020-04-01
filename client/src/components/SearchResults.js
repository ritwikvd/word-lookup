import React, { useContext } from 'react';
import SearchContext from "./context/searchContext";
import SingleSearchResult from "./SingleSearchResult";

const SearchResults = () => {

    const { searchWord, state: { words, searchResults, prompts, loading } } = useContext(SearchContext);

    if (loading) return <p>Loading...</p>;

    if (Object.keys(searchResults).length && !prompts.length) return <SingleSearchResult />

    const displayWords = prompts.length ? prompts : words;
    
    return (
        <div className="results-container">
            <ul className="results-list">
                {displayWords.map(word => word.word).map(word => <li key = {word} onClick={() => searchWord(word)}>{word}</li>)}
            </ul>
        </div>
    )
};

export default SearchResults;
