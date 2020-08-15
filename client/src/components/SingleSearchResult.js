import React, { useState, useContext } from "react";
import SearchContext from "./context/searchContext";
import Senses from "./Senses";

const SingleSearchResult = () => {
	const {
		clearSearch,
		deleteWord,
		state: { searchResults }
	} = useContext(SearchContext);

	const [confirmDelete, setConfirmDelete] = useState(false);

	const { word, derivatives = [], etymologies, lexicalCategory, phoneticSpelling, senses, extras = [] } = searchResults;

	const confirmAndDelete = () =>
		confirmDelete
			? prompt("What's the magic word?", "Please?") === process.env.REACT_APP_DELETE_PASS
				? deleteWord(word)
				: alert("Nice try, but can't let you do that :)")
			: setConfirmDelete(true);

	return (
		<div className="results-container">
			<h3>{word}</h3>

			<audio autoPlay controls src={`${process.env.REACT_APP_PROXY}/${word}.mp3`} />

			<p>{phoneticSpelling === "N/A" ? null : phoneticSpelling}</p>

			<p>{lexicalCategory}</p>

			<p>{derivatives.join("; ")}</p>

			{senses ? <Senses {...{ senses }} /> : null}

			{extras.length
				? extras.map(extra => (
						<>
							<p>{extra.phoneticSpelling === "N/A" ? null : extra.phoneticSpelling}</p>

							<p>{extra.lexicalCategory}</p>

							<p>{extra.derivatives.join("; ")}</p>

							{extra.senses ? <Senses {...{ senses: extra.senses }} /> : null}
						</>
				  ))
				: null}

			<p>{etymologies.join(",").replace("N/A", "")}</p>

			<button className={confirmDelete ? "btn-del-word danger" : "btn-del-word"} onClick={confirmAndDelete}>
				{confirmDelete ? "Are you sure?" : "Delete Word"}
			</button>
			<button className="btn-clear-search" onClick={clearSearch}>
				Back to all
			</button>
		</div>
	);
};

export default SingleSearchResult;
