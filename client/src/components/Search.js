import React, { useContext, useState, useEffect } from 'react';
import SearchContext from "./context/searchContext";

const Search = () => {

    const { searchWord, promptWord, addWord, state: { alert, prompts, searchResults } } = useContext(SearchContext);

    const [value, setValue] = useState("");
    const [fade, setFadeAlert] = useState(false);
    const [missing, setMissing] = useState(false);

    const updateValueAndPrompt = ({ target: { value } }) => {
        setValue(value);
        setMissing(false);
        promptWord(value);
    };

    const searchForWord = e => {
        e.preventDefault();

        if (!prompts.length && !value) return setMissing(true);

        searchWord(value);
        setValue("");
    };

    useEffect(() => {
        setFadeAlert(false);
        alert && setTimeout(() => setFadeAlert(true), 5000)
    }, [alert]);

    useEffect(() => {
        setValue("");
    }, [searchResults]);

    useEffect(() => {
        const title = document.querySelector("title");
        title.textContent = "Word Lookup";
    }, []);

    return (
        <>
            <div className={fade? "alert-container fade": "alert-container"}>
                {alert}
            </div>


            <div className="search-container">

                <form action="#" className="search-form" onSubmit={searchForWord}>
                    
                    <input type="text" value={value} onChange={updateValueAndPrompt}
                        className={missing ? "search-box shake" : "search-box"}
                        placeholder={missing? "?": "Search for a word"} />
                    {value && !prompts.length? <button className="btn-add-word" onClick={() => addWord(value)}>Add Word</button>: null}
                    
                </form>

            </div>
        </>
    )
};

export default Search;
