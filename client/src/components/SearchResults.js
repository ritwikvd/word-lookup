import React, { useContext } from 'react';
import SearchContext from "./context/searchContext";
import Senses from "./Senses";

const SearchResults = () => {

    const { state: { searchedWord, searchResults } } = useContext(SearchContext);

    const { derivatives, etymologies, lexicalCategory, phoneticSpelling, senses } = searchResults;

    return (
        <div className="results-container">
            {/* <audio src={`../../../audio-uploads/${searchedWord}.mp3`} controls /> */}
            <h3>{searchedWord}</h3>
            <p>{phoneticSpelling}</p>
            <p>{lexicalCategory}</p>
            <p>{derivatives}</p>
            {senses ? <Senses {...{senses}} />: null}
            <p>{etymologies}</p>

        </div>
    )
};

export default SearchResults;
