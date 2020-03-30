import React, { useContext, useState } from 'react';
import SearchContext from "./context/searchContext";

const Search = () => {

    const { searchWord, state: { alerts } } = useContext(SearchContext);

    const [value, setValue] = useState(""); 

    const searchForWord = e => {
        e.preventDefault();
        searchWord(value);
    }

    return (
        <>
            <div className="alert-container">
                {alerts}
            </div>
            <div className="search-container">
                <form action="#" className="search-form" onSubmit = {searchForWord}>
                    <input type="text" value = {value} onChange = {e => setValue(e.target.value)} className="search-box" 
                        placeholder="Search for a word" />
                    <button className="btn-submit" type = "submit">Search</button>
                </form>
                </div>
        </>
    )
};

export default Search;
