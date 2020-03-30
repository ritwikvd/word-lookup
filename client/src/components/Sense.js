import React from 'react';

const Sense = ({ sense }) => {

    const { definitions, examples, subsenses, synonyms, domains, registers } = sense;

    return (
        <div className="sense-container">
            <span>{domains.join(", ")}</span> <span>{registers.join(", ")}</span>
            <p>{definitions.join(" ;")}</p>
            <p>"{examples.join(" ;")}"</p>
            <p>Similar: {synonyms.join(", ")}</p>
            <ul>
                {subsenses.map(subsense => <li key={subsense._id}><Sense {...{ sense: subsense }}/></li>)}
            </ul>
        </div>
    )
};

export default Sense;
