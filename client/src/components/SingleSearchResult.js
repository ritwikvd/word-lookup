import React, { useState, useContext } from 'react';
import SearchContext from "./context/searchContext";
import Senses from "./Senses";

const SingleSearchResult = () => {

    const { clearSearch, deleteWord, state: { searchResults } } = useContext(SearchContext);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const { word, derivatives = [], etymologies, lexicalCategory, phoneticSpelling, senses } = searchResults;

    const confirmAndDelete = () => confirmDelete ? deleteWord(word) : setConfirmDelete(true);

    return (
        <div className="results-container">

            <h3>{word}</h3>

            <audio autoPlay controls src={`${process.env.REACT_APP_PROXY}/${word.replace(" ","_")}.mp3`}/>       

            <p>{phoneticSpelling === "N/A"? null : phoneticSpelling}</p>

            <p>{lexicalCategory}</p>

            <p>{derivatives.join("; ")}</p>

            {senses ? <Senses {...{ senses }} /> : null}
            
            <p>{etymologies.join(",").replace("N/A", "")}</p>

            <button className={confirmDelete ? "btn-del-word danger" : "btn-del-word"} onClick={confirmAndDelete}>{confirmDelete? "Are you sure?": "Delete Word"}</button>
            <button className="btn-clear-search" onClick = {clearSearch}>Back to all</button>

        </div>
    )
}

export default SingleSearchResult;
