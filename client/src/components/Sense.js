import React from "react";

const Sense = ({ sense }) => {
	const { definitions, examples, subsenses, synonyms, domains, registers } = sense;

	return (
		<div className="sense-container">
			{domains.length ? <span>{domains.join(", ")}</span> : null}

			{registers.length ? <span>{registers.join(", ")}</span> : null}

			<p>{definitions.join(" ;")}</p>

			{examples.length ? <p>"{examples.join(" ;")}"</p> : null}

			{synonyms.length ? <p>Similar: {synonyms.join(", ")}</p> : null}

			<ul className="ml-20">
				{subsenses.map(subsense => (
					<li key={subsense._id}>
						<Sense {...{ sense: subsense }} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sense;
